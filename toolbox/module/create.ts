export async function createModule(name: string): Promise<void> {
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

  const capitalizedName = `${name[0].toUpperCase()}${
    name.substring(1).toLowerCase()
  }`;

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

function getApiExampleContent(name: string) {
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
