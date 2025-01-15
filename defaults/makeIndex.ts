import { EmptyObject } from "$root/defaults/interfaces.ts";

export default function makeIndex<
  IndexProps = EmptyObject,
>(basePath: string) {
  return async function Index(props: IndexProps) {
    const index = (await import(`${basePath}/partials/index.tsx`)).Index;
    return index(props);
  };
}
