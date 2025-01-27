import { FreshContext } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { AuthenticatedState } from "$root/defaults/interfaces.ts";
import Navbar from "$root/routes/(_islands)/Navbar.tsx";

// deno-lint-ignore require-await
export default async function AppLayout(
  request: Request,
  context: FreshContext<AuthenticatedState>,
) {
  const pathname = new URL(request.url).pathname;
  const currentApp = pathname.split("/")[1];

  return (
    <section id="app">
      <Navbar currentApp={currentApp} pages={context.state.availablePages} />
      <section id="app-body">
        <Partial name="body">
          <context.Component />
        </Partial>
      </section>
    </section>
  );
}
