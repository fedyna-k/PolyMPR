import PartialLink from "$root/routes/(_components)/PartialLink.tsx";
import { JSX } from "preact/jsx-runtime";

type NavbarProps = {
  currentApp: string;
  pages: Record<string, string>;
};

export default function Navbar(props: NavbarProps) {
  const links: JSX.Element[] = [];

  for (const page in props.pages) {
    links.push(
      <PartialLink
        link={`/${props.currentApp}${page === "index" ? "" : `/${page}`}`}
        partial={`/${props.currentApp}/partials${
          page === "index" ? "" : `/${page}`
        }`}
        display={props.pages[page]}
      />,
    );
  }

  return (
    <nav>
      {links}
    </nav>
  );
}
