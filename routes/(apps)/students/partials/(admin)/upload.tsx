import UploadStudents from "$root/routes/(apps)/students/(_islands)/UploadStudents.tsx";
import {
  getPartialsConfig,
  makePartials,
} from "$root/defaults/makePartials.tsx";
import { FreshContext } from "$fresh/server.ts";
import { State } from "$root/routes/_middleware.ts";
//import EditStudents from "../(_islands)/EditStudents.tsx";

// deno-lint-ignore require-await
async function Students(_request: Request, _context: FreshContext<State>) {
  return (
    <>
      <h1>Manage Promotions</h1>
      <UploadStudents />
    </>
  );
}

export const config = getPartialsConfig();
export default makePartials(Students);
