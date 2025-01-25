import { FreshContext, Handlers } from "$fresh/server.ts";
import { State } from "$root/defaults/interfaces.ts";
import { deleteCookie } from "$std/http/cookie.ts";

const CAS = "https://ident.univ-amu.fr/cas";

export const handler: Handlers<null, State> = {
  /**
   * Logout of amU CAS SSO system.
   * @param _request The HTTP incomming request.
   * @param context The Fresh context with `State`.
   * @returns A redirect response to either CAS logout or home.
   */
  GET(_request: Request, context: FreshContext<State, null>): Response {
    if (context.state.isAuthenticated) {
      const headers = new Headers();

      deleteCookie(headers, "sessionToken", { path: "/" });
      headers.set("Location", `${CAS}/logout?service=${context.url.origin}`);

      return new Response(null, {
        status: 302,
        headers,
      });
    } else {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }
  },
};
