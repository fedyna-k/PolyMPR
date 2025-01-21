import { AppProperties } from "$root/defaults/interfaces.ts";

const properties: AppProperties = {
  name: "Students",
  icon: "badge",
  pages: {
    index: "Homepage",
    upload: "Upload students",
  },
  adminOnly: ["upload"],
  hint: "See student information",
};

export default properties;
