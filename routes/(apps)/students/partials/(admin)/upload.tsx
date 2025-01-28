import UploadStudents from "../../(_islands)/UploadStudents.tsx";
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
      <h2>Upload Students</h2>
      <UploadStudents />
    </>
  );
}

export const config = getPartialsConfig();
export default makePartials(Students);
