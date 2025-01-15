export interface AppProperties {
  name: string;
  icon: string;
}

type AppNavigatorProps = Record<string | number | symbol, never>;

export default async function AppNavigator(_props: AppNavigatorProps) {
  
  const apps: Record<string, AppProperties> = {};

  for await (const appDir of Deno.readDir("../(apps)")) {
    try {
      const properties: AppProperties = await import(`../(apps)/${appDir.name}/(_props)/props.ts`);
      apps[appDir.name] = properties;
    }
    catch (error) {
      console.error(`Couldn't import app "${appDir.name}": ${error}`);
    }
  }

  return (
    <>
      <p>{JSON.stringify(apps)}</p>
    </>
  );
}
