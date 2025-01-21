import {
  getPartialsConfig,
  makePartials,
} from "$root/defaults/makePartials.tsx";
import { FreshContext } from "$fresh/server.ts";
import { State } from "$root/routes/_middleware.ts";

// deno-lint-ignore require-await
export async function Index(_request: Request, context: FreshContext<State>) {
  return <h2>Welcome to {context.state.session?.displayName}.</h2>;
}

export const config = getPartialsConfig();
export default makePartials(Index);
