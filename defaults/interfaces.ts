export interface AppProperties {
  name: string;
  icon: string;
  pages: Record<string, string>;
  adminOnly: string[];
}

export type EmptyObject = Record<string | number | symbol, never>;
