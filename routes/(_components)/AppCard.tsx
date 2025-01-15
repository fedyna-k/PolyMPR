import { AppProperties } from "$root/defaults/interfaces.ts";

type AppCardProps = {
  app: AppProperties;
  href: string;
};

export default function AppCard(props: AppCardProps) {
  return (
    <a class="app-card" href={`/${props.href}`} f-client-nav={false}>
      <span class="material-symbols-outlined">{props.app.icon}</span>
      <p>{props.app.name}</p>
      <span class="material-symbols-outlined info" data-hint={props.app.hint}>
        info
      </span>
    </a>
  );
}
