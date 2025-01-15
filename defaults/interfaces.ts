export interface AppProperties {
  name: string;
  icon: string;
  pages: Record<string, string>;
  adminOnly: string[];
  hint: string;
}

export type EmptyObject = Record<string | number | symbol, never>;
