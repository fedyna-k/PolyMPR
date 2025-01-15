import {
  getPartialsConfig,
  makePartials,
} from "$root/defaults/makePartials.tsx";
import { EmptyObject } from "$root/defaults/interfaces.ts";

type MobilityIndexProps = EmptyObject;

export function Index(_props: MobilityIndexProps) {
  return <p>Nothing to see here...</p>;
}

export const config = getPartialsConfig();
export default makePartials(Index);
