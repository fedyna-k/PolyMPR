import { AppProperties } from "$root/routes/(_islands)/AppNavigator.tsx";

const properties: AppProperties = {
  name: "PolyNotes",
  icon: "school",
  pages: {
    index: "Homepage",
    notes: "Notes",
    courses: "Courses management",
    students: "Students management"
  },
  adminOnly: [ "courses", "students" ]
};

export default properties;