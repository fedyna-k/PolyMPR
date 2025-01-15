import {
  getPartialsConfig,
  makePartials,
} from "$root/defaults/makePartials.tsx";

type NotesIndexProps = Record<string | number | symbol, never>;

export function Index(_props: NotesIndexProps) {
  return <a href="notes" f-partial={"notes/partials"}>bip boup</a>;
}

export const config = getPartialsConfig();
export default makePartials(Index);
