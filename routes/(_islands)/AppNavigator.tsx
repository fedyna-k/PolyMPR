import { AppProperties } from "$root/defaults/interfaces.ts";
import AppCard from "$root/routes/(_components)/AppCard.tsx";

type AppNavigatorProps = {
  apps: Record<string, AppProperties>;
};

export default function AppNavigator(props: AppNavigatorProps) {
  if (!props.apps) {
    return (
      <>
        <h2>App catalog</h2>
        <p>
          No apps are currently available. Please contact the maintainers team
          to address this issue.
        </p>
      </>
    );
  }

  return (
    <>
      <h2>App catalog</h2>
      <div class="app-list">
        {Object.entries(props.apps).map(([key, app]) => (
          <AppCard href={key} app={app} />
        ))}
      </div>
    </>
  );
}
