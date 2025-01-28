import { FreshContext } from "$fresh/server.ts";
import { State } from "$root/defaults/interfaces.ts";
import Header from "$root/routes/(_components)/Header.tsx";
import Footer from "$root/routes/(_components)/Footer.tsx";

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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Recursive:slnt,wght@-15..0,300..1000&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <link rel="stylesheet" href="/styles/main.css" />
        <link rel="stylesheet" href="/styles/app.css" />
        <link rel="stylesheet" href="styles/app-cards.css" />
        <link rel="stylesheet" href="styles/students.css" />
      </head>
      <body f-client-nav>
        <Header link={link} />
        <section>
          <context.Component />
        </section>
        <Footer />
      </body>
    </html>
  );
}
