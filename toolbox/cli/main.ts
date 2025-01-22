import { parseArgs, ParseOptions } from "@std/cli/parse-args";
import { runCommand } from "$root/toolbox/cli/command.ts";
import { CLI } from "$root/toolbox/cli/help.ts";

/**
 * Runs the CLI.
 * @param cli The CLI configuration object.
 * @param argSpec The Parse options for args.
 */
export function main(cli: CLI, argSpec: ParseOptions) {
  const argv = parseArgs(Deno.args, argSpec);
  const { command, args } = runCommand(argv._, cli);
  command(...args.map((element) => element.toString()));
}
