import { JSX } from "preact";
import { Partial } from "$fresh/runtime.ts";
import { FreshContext, RouteConfig } from "$fresh/server.ts";
import { State } from "$root/routes/_middleware.ts";

export function getPartialsConfig(): RouteConfig {
  return {
    skipAppWrapper: true,
    skipInheritedLayouts: true,
  };
}

export function makePartials(
  page: (
    request: Request,
    context: FreshContext<State>,
  ) => Promise<JSX.Element>,
) {
  return async function WrappedElements(
    request: Request,
    context: FreshContext<State>,
  ): Promise<JSX.Element> {
    return (
      <Partial name="body">
        {await page(request, context)}
      </Partial>
    );
  };
}
