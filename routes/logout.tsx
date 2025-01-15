import { Handlers } from "$fresh/server.ts";
import { State } from "$root/routes/_middleware.ts";
import { deleteCookie } from "$std/http/cookie.ts";

const SERVICE = "https://localhost/";
const CAS = "https://ident.univ-amu.fr/cas";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  GET(_request, context) {
    if (context.state.isAuthenticated) {
      const headers = new Headers();

      deleteCookie(headers, "sessionToken", { path: "/" });
      headers.set("Location", `${CAS}/logout?service=${SERVICE}`);

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
