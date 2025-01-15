import { FreshContext } from "$fresh/server.ts";

// deno-lint-ignore require-await
export default async function About(_request: Request, _context: FreshContext) {
  return (
    <>
      <h2>About PolyMPR</h2>
      <p>
        PolyMPR is born from the will to enhance Polytech INFO department's HR
        infrastructure.
      </p>
      <h3>Terms of Use</h3>
    </>
  );
}
