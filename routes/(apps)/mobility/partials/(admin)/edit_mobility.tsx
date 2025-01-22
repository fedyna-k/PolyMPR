import EditMobility from "$root/routes/(apps)/mobility/(_islands)/EditMobility.tsx";
import { getPartialsConfig, makePartials } from "$root/defaults/makePartials.tsx";
import { FreshContext } from "$fresh/server.ts";
import { State } from "$root/routes/_middleware.ts";

async function Mobility(_request: Request, _context: FreshContext<State>) {
  return (
    <>
      <h1>Edit mobility</h1>
      <EditMobility />
    </>
  );
}

export const config = getPartialsConfig();
export default makePartials(Mobility);
