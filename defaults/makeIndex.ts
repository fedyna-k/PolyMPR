import { FreshContext } from "$fresh/server.ts";
import { State } from "$root/routes/_middleware.ts";

export default function makeIndex(basePath: string) {
  return async function Index(
    request: Request,
    context: FreshContext<State>,
  ) {
    const index = (await import(`${basePath}/partials/index.tsx`)).Index;
    return index(request, context);
  };
}
