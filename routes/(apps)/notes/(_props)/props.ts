import { AppProperties } from "$root/defaults/interfaces.ts";

const properties: AppProperties = {
  name: "PolyNotes",
  icon: "school",
  pages: {
    index: "Homepage",
    notes: "Notes",
    courses: "Courses management",
    students: "Students management",
  },
  adminOnly: ["courses", "students"],
  hint: "Gestionnaire de note",
};

export default properties;
