// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_apps_layout from "./routes/(apps)/_layout.tsx";
import * as $_apps_mobility_index from "./routes/(apps)/mobility/index.tsx";
import * as $_apps_mobility_partials_index from "./routes/(apps)/mobility/partials/index.tsx";
import * as $_apps_notes_index from "./routes/(apps)/notes/index.tsx";
import * as $_apps_notes_partials_admin_courses from "./routes/(apps)/notes/partials/(admin)/courses.tsx";
import * as $_apps_notes_partials_admin_students from "./routes/(apps)/notes/partials/(admin)/students.tsx";
import * as $_apps_notes_partials_index from "./routes/(apps)/notes/partials/index.tsx";
import * as $_apps_notes_partials_notes from "./routes/(apps)/notes/partials/notes.tsx";
import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $about from "./routes/about.tsx";
import * as $apps from "./routes/apps.tsx";
import * as $index from "./routes/index.tsx";
import * as $login from "./routes/login.tsx";
import * as $logout from "./routes/logout.tsx";
import * as $_islands_AppNavigator from "./routes/(_islands)/AppNavigator.tsx";
import * as $_islands_Navbar from "./routes/(_islands)/Navbar.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/(apps)/_layout.tsx": $_apps_layout,
    "./routes/(apps)/mobility/index.tsx": $_apps_mobility_index,
    "./routes/(apps)/mobility/partials/index.tsx":
      $_apps_mobility_partials_index,
    "./routes/(apps)/notes/index.tsx": $_apps_notes_index,
    "./routes/(apps)/notes/partials/(admin)/courses.tsx":
      $_apps_notes_partials_admin_courses,
    "./routes/(apps)/notes/partials/(admin)/students.tsx":
      $_apps_notes_partials_admin_students,
    "./routes/(apps)/notes/partials/index.tsx": $_apps_notes_partials_index,
    "./routes/(apps)/notes/partials/notes.tsx": $_apps_notes_partials_notes,
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/about.tsx": $about,
    "./routes/apps.tsx": $apps,
    "./routes/index.tsx": $index,
    "./routes/login.tsx": $login,
    "./routes/logout.tsx": $logout,
  },
  islands: {
    "./routes/(_islands)/AppNavigator.tsx": $_islands_AppNavigator,
    "./routes/(_islands)/Navbar.tsx": $_islands_Navbar,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
