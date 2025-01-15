import { JSX } from "preact";
import { Partial } from "$fresh/runtime.ts";
import { RouteConfig } from "$fresh/server.ts";

export function getPartialsConfig(): RouteConfig {
  return {
    skipAppWrapper: true,
    skipInheritedLayouts: true,
  };
}

// deno-lint-ignore no-explicit-any
export function makePartials<Props extends any>(
  page: (props: Props) => JSX.Element,
) {
  return function WrappedElements(props: Props): JSX.Element {
    return (
      <Partial name="body">
        {page(props)}
      </Partial>
    );
  };
}
