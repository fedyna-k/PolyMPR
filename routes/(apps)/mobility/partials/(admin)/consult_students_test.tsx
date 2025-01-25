import ConsultStudents_test from "$root/routes/(apps)/mobility/(_islands)/ConsultStudents_test.tsx";
import {
  getPartialsConfig,
  makePartials,
} from "$root/defaults/makePartials.tsx";
import { FreshContext } from "$fresh/server.ts";
import { State } from "$root/routes/_middleware.ts";
//import EditStudents from "../(_islands)/EditStudents.tsx";

// deno-lint-ignore require-await
async function Mobility(_request: Request, _context: FreshContext<State>) {
  return (
    <>
      <h1>Test consult students</h1>
      <ConsultStudents_test />
    </>
  );
}

export const config = getPartialsConfig();
export default makePartials(Mobility);
