import { FreshContext } from "$fresh/server.ts";

// deno-lint-ignore require-await
export default async function Home(_request: Request, _context: FreshContext) {
  return (
    <>
      <h2>Welcome to PolyMPR!</h2>
    </>
  );
}
