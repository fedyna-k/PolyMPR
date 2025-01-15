import { AppProperties } from "$root/defaults/interfaces.ts";

type AppCardProps = {
  app: AppProperties;
  href: string;
};

export default function AppCard(props: AppCardProps) {
  return (
    <div className="app-card">
      <a href={`/${props.href}`} f-client-nav={false}>
        <span className="material-symbols-outlined">{props.app.icon}</span>
        <p>{props.app.name}</p>
      </a>
    </div>
  );
}
