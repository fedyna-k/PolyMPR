import { Partial } from "$fresh/runtime.ts";
import { RouteConfig } from "$fresh/server.ts";

type ModulesProps = Record<string | number | symbol, never>;

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default function Modules(_props: ModulesProps) {
  return (
    <Partial name="body">
      <a href="mobility" f-partial={"notes/partials"}>mobility</a>
    </Partial>
  );
}
