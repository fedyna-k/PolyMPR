import ConsultStudents from "$root/routes/(apps)/students/(_islands)/ConsultStudents.tsx";
import {
  getPartialsConfig,
  makePartials,
} from "$root/defaults/makePartials.tsx";
import { FreshContext } from "$fresh/server.ts";
import { State } from "$root/defaults/interfaces.ts";

// deno-lint-ignore require-await
async function Students(_request: Request, _context: FreshContext<State>) {
  return (
    <>
      <h1>Manage Promotions</h1>
      <ConsultStudents />
    </>
  );
}

export const config = getPartialsConfig();
export default makePartials(Students);
