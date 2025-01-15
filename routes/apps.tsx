import { FreshContext, Handlers } from "$fresh/server.ts";
import AppNavigator, { AppProperties } from "$root/routes/(_islands)/AppNavigator.tsx";

export const handler: Handlers = {
  async GET(_request, context) {
    const apps: Record<string, AppProperties> = {};

    for await (const appDir of Deno.readDir("routes/(apps)")) {
      if (appDir.isFile) {
        continue;
      }

      try {
        const properties: AppProperties = (await import(
          `./(apps)/${appDir.name}/(_props)/props.ts`
        )).default;
        apps[appDir.name] = properties;
      } catch (error) {
        console.error(`Couldn't import app "${appDir.name}": ${error}`);
      }
    }

    return context.render(apps);
  },
};

// deno-lint-ignore require-await
export default async function About(_request: Request, context: FreshContext) {
  return (
    <>
      <AppNavigator apps={context.data} />
    </>
  );
}
