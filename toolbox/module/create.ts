export async function createModule(name: string): Promise<void> {
  if (!name.match(/^[a-zA-Z0-9](?:(?:\-(?!\-))?[a-zA-Z0-9]*)*[a-zA-Z0-9]$/)) {
    console.error("Module names must be in kebab case.");
    Deno.exit(1);
  }

  console.log(`Checking for module ${name}...`);

  try {
    await Deno.mkdir(`routes/(apps)/${name}`);
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }

    console.error(`Some module is already named ${name}, aborting.`);
    Deno.exit(1);
  }

  const capitalizedName = name.match(/(^\w)|(\-\w)/g)!.reduce(
    (word, pattern) => word.replace(pattern, pattern.at(-1)!.toUpperCase()),
    name,
  );

  Promise.allSettled([
    createDir(`routes/(apps)/${name}/(_props)`),
    createDir(`routes/(apps)/${name}/partials`),
    createDir(`routes/(apps)/${name}/(_islands)`),
    createDir(`routes/(apps)/${name}/(_components)`),
    createDir(`routes/(apps)/${name}/api`),
  ]);

  Promise.allSettled([
    createFile(
      `routes/(apps)/${name}/index.tsx`,
      getIndexContent(capitalizedName),
    ),
    createFile(
      `routes/(apps)/${name}/(_props)/props.ts`,
      getPropsContent(capitalizedName),
    ),
    createFile(
      `routes/(apps)/${name}/partials/index.tsx`,
      getPartialIndexContent(capitalizedName),
    ),
    createFile(
      `routes/(apps)/${name}/api/example.ts`,
      getApiExampleContent(capitalizedName),
    ),
  ]);

  const formatter = new Deno.Command(Deno.execPath(), {
    args: [
      "fmt",
      `routes/(apps)/${name}`,
    ],
  });
  formatter.output();
}

function createFile(path: string, content: string): Promise<void> {
  console.log(`Creating file ${path}...`);
  return Deno.writeTextFile(path, content);
}

function createDir(path: string): Promise<void> {
  console.log(`Creating directory ${path}...`);
  return Deno.mkdir(path);
}

function getIndexContent(_name: string) {
  return `
    import makeIndex from "$root/defaults/makeIndex.ts";
    export default makeIndex(import.meta.dirname!);
  `;
}

function getPartialIndexContent(name: string) {
  return `
    import { EmptyObject } from "$root/defaults/interfaces.ts";
    import {
      getPartialsConfig,
      makePartials,
    } from "$root/defaults/makePartials.tsx";
    
    type ${name}IndexProps = EmptyObject;
    
    export function Index(_props: ${name}IndexProps) {
      return <h2>Welcome to ${name}.</h2>;
    }
    
    export const config = getPartialsConfig();
    export default makePartials(Index);
  `;
}

function getPropsContent(name: string) {
  return `
    import { AppProperties } from "$root/defaults/interfaces.ts";
    
    const properties: AppProperties = {
      name: "${name}",
      icon: "school",
      pages: {
        index: "Homepage",
      },
      adminOnly: [],
      hint: "PolyMPR module",
    };
    
    export default properties;
  `;
}

function getApiExampleContent(_name: string) {
  return `
    import { Handlers } from "$fresh/server.ts";
    
    export const handler: Handlers = {
      async POST(request, context) {
        if (request.headers.get("content-type") != "application/json") {
          return new Response(null, {
            status: 400
          });
        }
    
        const responseBody = {
          requestBody: await request.json(),
          context,
        };
    
        return new Response(JSON.stringify(responseBody), {
          headers: {
            "content-type": "application/json",
          },
        });
      },
    };
  `;
}
