import { AppProperties } from "$root/defaults/interfaces.ts";

type AppNavigatorProps = {
  apps: Record<string, AppProperties>;
};

export default function AppNavigator(props: AppNavigatorProps) {
  return (
    <>
      <p>{JSON.stringify(props.apps)}</p>
    </>
  );
}
