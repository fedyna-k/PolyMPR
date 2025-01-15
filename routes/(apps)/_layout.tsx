import { FreshContext } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { State } from "$root/routes/_middleware.ts";
import Navbar from "$root/routes/(_islands)/Navbar.tsx";
import { AppProperties } from "$root/routes/(_islands)/AppNavigator.tsx";

export default async function AppLayout(
  request: Request,
  context: FreshContext<State>,
) {
  const currentApp = new URL(request.url).pathname;
  const properties: AppProperties = (await import(
    `./${currentApp}/(_props)/props.ts`
  )).default; 

  return (
    <>
      <Navbar pages={properties.pages} />
      <Partial name="body">
        <context.Component />
      </Partial>
    </>
  );
}
