import { FreshContext, Handlers } from "$fresh/server.ts";
import { AppProperties, State } from "$root/defaults/interfaces.ts";
import AppNavigator from "$root/routes/(_islands)/AppNavigator.tsx";

const apps: Record<string, AppProperties> = {};

export const handler: Handlers<Record<string, AppProperties>, State> = {
  /**
   * Generate the app catalog page from pages.
   * Catalog is only computed once, then the cached version is used.
   * @param _request The HTTP incomming request.
   * @param context The Fresh context with `State`.
   * @returns The rendered page with all apps as catalog.
   */
  async GET(
    _request: Request,
    context: FreshContext<State, Record<string, AppProperties>>,
  ): Promise<Response> {
    if (Object.keys(apps).length != 0) {
      return context.render(apps);
    }

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
export default async function Apps(
  _request: Request,
  context: FreshContext<State, Record<string, AppProperties>>,
) {
  return (
    <>
      <AppNavigator apps={context.data} />
    </>
  );
}
