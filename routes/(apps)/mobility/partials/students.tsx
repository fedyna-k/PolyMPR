import { Partial } from "$fresh/runtime.ts";
import { RouteConfig } from "$fresh/server.ts";
import UploadStudents from "../(_islands)/UploadStudents.tsx";
import SaveStudents from "../(_islands)/SaveStudents.tsx";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default function Students() {
  return (
    <Partial name="body">
      <h1>Manage Promotions</h1>
      <UploadStudents />
      <hr />
      <SaveStudents />
    </Partial>
  );
}
