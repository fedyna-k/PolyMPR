import { FreshContext } from "$fresh/server.ts";
import { Route, State } from "$root/defaults/interfaces.ts";
import { ComponentChildren } from "preact";

/**
 * Generates index file based on `Index` fresh partial to avoid code duplication.
 * @param basePath The base path of the module, should be `import.meta.url!`.
 * @returns The `Index` fresh partial that will be displayed by default.
 *
 * @example
 * import makeIndex from "$root/defaults/makeIndex.ts";
 * export default makeIndex(import.meta.dirname!);
 */
export default function makeIndex(basePath: string): Route {
  return async function Index(
    request: Request,
    context: FreshContext<State>,
  ): Promise<ComponentChildren | Response> {
    const index: Route = (await import(`${basePath}/partials/index.tsx`)).Index;
    return index(request, context);
  };
}
