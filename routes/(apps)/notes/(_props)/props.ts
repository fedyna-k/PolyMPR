import { AppProperties } from "$root/defaults/interfaces.ts";

const properties: AppProperties = {
  name: "PolyNotes",
  icon: "school",
  pages: {
    index: "Homepage",
    notes: "Notes",
    courses: "Courses management",
  },
  adminOnly: ["courses", "students"],
  hint: "Student grading management",
};

export default properties;
