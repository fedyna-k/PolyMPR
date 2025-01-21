import { Handlers } from "$fresh/server.ts";
import { State } from "$root/defaults/interfaces.ts";
import { deleteCookie } from "$std/http/cookie.ts";

const CAS = "https://ident.univ-amu.fr/cas";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  GET(_request, context) {
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
