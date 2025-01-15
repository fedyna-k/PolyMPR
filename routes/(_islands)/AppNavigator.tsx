import { AppProperties } from "$root/defaults/interfaces.ts";
import AppCard from "$root/routes/(_components)/AppCard.tsx";

type AppNavigatorProps = {
  apps: Record<string, AppProperties>;
};

export default function AppNavigator(props: AppNavigatorProps) {
  if (!props.apps) {
    return (
      <>
        <h2>Welcome to PolyMPR!</h2>
        <p>No apps available.</p>
      </>
    );
  }

  return (
    <>
      <h2>Welcome to PolyMPR!</h2>
      <h3>app list</h3>
      <div className="app-list">
        {Object.entries(props.apps).map(([key, app]) => (
          <AppCard href={key} app={app} />
        ))}
      </div>
    </>
  );
}
