import { AppProperties } from "../(_islands)/AppNavigator.tsx";

type ModuleCardProps = {
  module: AppProperties;
};

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <div className="module-card">
      <a href={`/${module.name}`}>
        <span className="material-symbols-outlined">{module.icon}</span>
        <p>{module.name}</p>
      </a>
    </div>
  );
}
