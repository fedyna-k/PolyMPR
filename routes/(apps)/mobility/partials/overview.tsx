import ConsultMobility from "$root/routes/(apps)/mobility/(_islands)/ConsultMobility.tsx";
import {
  getPartialsConfig,
  makePartials,
} from "$root/defaults/makePartials.tsx";
import { FreshContext } from "$fresh/server.ts";
import { State } from "$root/routes/_middleware.ts";

// deno-lint-ignore require-await
async function Mobility(_request: Request, _context: FreshContext<State>) {
  return (
    <>
      <h1>Edit mobility</h1>
      <ConsultMobility />
    </>
  );
}

export const config = getPartialsConfig();
export default makePartials(Mobility);
