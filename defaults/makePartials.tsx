import { JSX } from "preact";
import { Partial } from "$fresh/runtime.ts";
import { FreshContext, RouteConfig } from "$fresh/server.ts";
import { Route, State } from "$root/defaults/interfaces.ts";

/**
 * Gets the `RouteConfig` config object for partial pages.
 * @returns The partials config object.
 */
export function getPartialsConfig(): RouteConfig {
  return {
    skipAppWrapper: true,
    skipInheritedLayouts: true,
  };
}

/**
 * Partialize the given page for optimized rendering.
 * @param page The partial `Route` object to partialize. 
 * @returns The partialized version of `page`.
 * @example
 * // Page defintion...
 * async function Page(_request: Request, context: FreshContext<State>) {
 *   return <h2>My super page!</h2>;
 * }
 * 
 * // Partial code that should be at each file's end.
 * export const config = getPartialsConfig();
 * export default makePartials(Page);
 */
export function makePartials(page: Route) {
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
