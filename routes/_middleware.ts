import { FreshContext, MiddlewareHandler } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getJwtPayload, isJwtValid } from "@popov/jwt";
import { CasContent, LoginJWT, State } from "$root/defaults/interfaces.ts";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/logout",
  "/about",
  "/partials/about",
  "/contact",
];

const jwtKeyCache: Record<string, string> = {};
const deleteKey = (user: string) => delete jwtKeyCache[user];

/**
 * Checks if the given route is public.
 * @param route The route to check.
 * @returns `true` if the route is public, `false` otherwise.
 */
function isRoutePublic(route: string): boolean {
  return PUBLIC_ROUTES.includes(route) ||
    !!(route.match(/\..+$/)?.[0] ?? false);
}

/**
 * Get the given user's key, creating it if not already existing.
 * @param user The key's user.
 * @returns The user's key.
 */
export function getKey(user: string): string {
  if (!jwtKeyCache[user]) {
    const keyBuffer = new Uint8Array(32);
    crypto.getRandomValues(keyBuffer);
    jwtKeyCache[user] = new TextDecoder().decode(keyBuffer);
    setTimeout(deleteKey, 0x75300, user);
  }

  return jwtKeyCache[user];
}

export const handler: MiddlewareHandler<State>[] = [
  /**
   * Check if user is authenticated and add session to context accordingly.
   * @param request The HTTP incomming request.
   * @param context The Fresh context object with custom `State`.
   * @returns The response from the next middleware.
   */
  async function checkAuthentication(
    request: Request,
    context: FreshContext<State>,
  ): Promise<Response> {
    const cookies = getCookies(request.headers);
    if (!cookies["sessionToken"]) {
      context.state.isAuthenticated = false;
      return await context.next();
    }

    const content = getJwtPayload(cookies["sessionToken"]) as LoginJWT;
    const key = getKey(content.user.uid);

    context.state.isAuthenticated = await isJwtValid(
      cookies["sessionToken"],
      key,
    );

    if (context.state.isAuthenticated) {
      const session: CasContent =
        (getJwtPayload(cookies["sessionToken"]) as LoginJWT).user;
      context.state.session = session;
    }

    return await context.next();
  },
  /**
   * Check if page can be accessed with or without authentication.
   * Redirect if the page is private and the user isn't authenticated.
   * @param request The HTTP incomming request.
   * @param context The Fresh context object with `State` set up.
   * @returns The response from the next middleware or from the page.
   */
  async function ensureAuthentication(
    request: Request,
    context: FreshContext<State>,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (!isRoutePublic(url.pathname) && !context.state.isAuthenticated) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/login",
        },
      });
    }

    return await context.next();
  },
];
