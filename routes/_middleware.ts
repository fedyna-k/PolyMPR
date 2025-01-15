import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { isJwtValid } from "@popov/jwt";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/logout",
  "/about",
  "/partials/about",
  "/contact",
];

export interface State {
  isAuthenticated: boolean;
}

function isRoutePublic(route: string) {
  return PUBLIC_ROUTES.includes(route) || route.match(/\..+$/);
}

export const handler = [
  async function checkAuthentication(
    request: Request,
    context: FreshContext<State>,
  ) {
    const cookies = getCookies(request.headers);
    context.state.isAuthenticated = await isJwtValid(
      cookies["sessionToken"] ?? "",
      "NEED TO CHANGE THIS KEY FURTHER IN DEV",
    );

    return await context.next();
  },
  async function ensureAuthentication(
    request: Request,
    context: FreshContext<State>,
  ) {
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
