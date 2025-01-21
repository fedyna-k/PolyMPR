import { AppProperties } from "$root/defaults/interfaces.ts";

const properties: AppProperties = {
  name: "Students",
  icon: "badge",
  pages: {
    index: "Homepage",
    overview: "Students overview",
    upload: "Upload students",
    consult: "Consult students"
  },
  adminOnly: ["upload", "consult"],
  hint: "Create students promotion and see informations",
};

export default properties;
