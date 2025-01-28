import {
  getPartialsConfig,
  makePartials,
} from "$root/defaults/makePartials.tsx";
import { FreshContext } from "$fresh/server.ts";
import { State } from "$root/defaults/interfaces.ts";
import SelfPortrait from "$root/routes/(apps)/students/(_components)/SelfPortrait.tsx";

// deno-lint-ignore require-await
export async function Index(_request: Request, context: FreshContext<State>) {
  return (
    <>
      <h2>Welcome {context.state.session?.givenName}!</h2>
      <h3>Your amU identity</h3>
      <SelfPortrait self={context.state.session!} />
    </>
  );
}

export const config = getPartialsConfig();
export default makePartials(Index);
