import { FreshContext } from "$fresh/server.ts";
import AppNavigator from "./(_islands)/AppNavigator.tsx";

// deno-lint-ignore require-await
export default async function About(_request: Request, _context: FreshContext) {
  return (
    <>
      {
        //<AppNavigator />
      }
    </>
  );
}
