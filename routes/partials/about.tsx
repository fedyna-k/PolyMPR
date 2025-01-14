import { RouteConfig } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default async function About(request, context) {
  return (
    <Partial name="body">
      <p>C'est nous wsh</p>
    </Partial>
  );
};