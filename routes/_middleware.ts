import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { isJwtValid } from "@popov/jwt";


const PUBLIC_ROUTES = ["/", "/login", "/logout", "/about", "/contact"];

interface State {
  isAuthenticated: boolean;
}


function isRoutePublic(route: string) {
  return PUBLIC_ROUTES.includes(route) || route.match(/\..+$/);
}


export const handler = [
  async function checkAuthentication(request: Request, context: MiddlewareHandlerContext<State>) {
    const cookies = getCookies(request.headers);
    context.state.isAuthenticated = await isJwtValid(cookies["sessionToken"] ?? "", "NEED TO CHANGE THIS KEY FURTHER IN DEV");

    return context.next();
  },
  async function ensureAuthentication(request: Request, context: MiddlewareHandlerContext<State>) {
    const url = new URL(request.url);

    if (!isRoutePublic(url.pathname) && !context.state.isAuthenticated) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/login"
        }
      });
    }

    return context.next();
  }
];