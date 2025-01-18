import { RouteConfig } from "$fresh/server.ts";
import UploadStudents from "../(_islands)/UploadStudents.tsx";
//import ConsultStudents from "../(_islands)/ConsultStudents.tsx";
//import EditStudents from "../(_islands)/EditStudents.tsx";

export const config: RouteConfig = {
  skipAppWrapper: false,
  skipInheritedLayouts: false,
};

export default function Students() {
  return (
    <section id="students-page">
      <h1>Manage Promotions</h1>
      <UploadStudents />
      <hr />
    </section>
  );
}
