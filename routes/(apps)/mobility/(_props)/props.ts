import { AppProperties } from "$root/defaults/interfaces.ts";

const properties: AppProperties = {
  name: "PolyMobility",
  icon: "flight_takeoff",
  hint: "Student mobility management",
  pages: {
    index: "Homepage",
    overview: "Mobility overview",
    mobility: "Mobility management",
    consult_students_test: "Test consult students",
  },
  adminOnly: ["mobility", "consult_students_test"],
};

export default properties;
