import { FreshContext } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";


export default async function App(request: Request, context: FreshContext) {
  const link = context.state.isAuthenticated ? "out" : "in";

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PolyMPR</title>
        <link rel="stylesheet" href="/styles/main.css" />
      </head>
      <body f-client-nav>
        <header>
          <h1>PolyMPR</h1>
          <nav>
            <a href="/modules" f-partial="/partials/modules">Modules</a>
            <a href={`/log${link}`} f-client-nav={false}>Log {link}</a>
          </nav>
        </header>
        <Partial name="body">
          <context.Component />
        </Partial>
        <footer>
          <p>&copy; 2025 PolyMPR - <a href="/about" f-partial="/partials/about">About</a></p>
        </footer>
      </body>
    </html>
  );
}