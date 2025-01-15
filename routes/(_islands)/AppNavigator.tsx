export interface AppProperties {
  name: string;
  icon: string;
  hint: string;
}

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
