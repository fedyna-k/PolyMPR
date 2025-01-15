import { FreshContext, Handlers } from "$fresh/server.ts";
import ModuleCard from "./(_components)/ModuleCard.tsx";
import { AppProperties } from "./(_islands)/AppNavigator.tsx";

export const handler: Handlers = {
  async GET(_request, context) {
    const apps: Record<string, AppProperties> = {};

    for await (const appDir of Deno.readDir("routes/(apps)")) {
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
export default async function Home(_request: Request, context: FreshContext) {
  const apps: Record<string, AppProperties> = context.data;
  console.log("Context data:", context.data);

  if (!apps) {
    return (
      <>
        <h2>Welcome to PolyMPR!</h2>
        <p>No modules available.</p>
      </>
    );
  }

  return (
    <>
      <h2>Welcome to PolyMPR!</h2>
      <h3>Module list</h3>
      <div className="module-list">
        {Object.entries(apps).map(([key, module]) => (
          <ModuleCard key={key} module={module} />
        ))}
      </div>
    </>
  );
}
