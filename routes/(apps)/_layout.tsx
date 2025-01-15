import { FreshContext } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { State } from "$root/routes/_middleware.ts";
import { AppProperties } from "$root/defaults/interfaces.ts";
import Navbar from "$root/routes/(_islands)/Navbar.tsx";

export default async function AppLayout(
  request: Request,
  context: FreshContext<State>,
) {
  const pathname = new URL(request.url).pathname;
  const currentApp = pathname.split("/")[1];
  const properties: AppProperties = (await import(
    `./${currentApp}/(_props)/props.ts`
  )).default;

  return (
    <section id="app">
      <Navbar currentApp={currentApp} pages={properties.pages} />
      <Partial name="body">
        <context.Component />
      </Partial>
    </section>
  );
}
