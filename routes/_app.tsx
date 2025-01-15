import { FreshContext } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { State } from "./_middleware.ts";
import Header from "./(_components)/Header.tsx";
import Footer from "./(_components)/Footer.tsx";

// deno-lint-ignore require-await
export default async function App(
  _request: Request,
  context: FreshContext<State>,
) {
  const link = context.state.isAuthenticated ? "out" : "in";

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PolyMPR</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <link rel="stylesheet" href="/styles/main.css" />
      </head>
      <body f-client-nav>
        <Header link={link} />
        <section>
          <Partial name="body">
            <context.Component />
          </Partial>
        </section>
        <Footer />
      </body>
    </html>
  );
}
