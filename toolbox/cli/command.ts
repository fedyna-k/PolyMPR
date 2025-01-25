import {
  CLI,
  CLIAsyncCommand,
  CLICommand,
  displayHelp,
} from "$root/toolbox/cli/help.ts";

/**
 * Run the command given by arguments.
 * @param commands The given arguments.
 * @param cli The CLI (sub-)configuration object.
 * @returns The command or the help if commands are not valid.
 */
export function runCommand(
  commands: Array<string | number>,
  cli: CLI,
): never | {
  command: CLICommand | CLIAsyncCommand;
  args: Array<string | number>;
} {
  if (commands.length == 0) {
    displayHelp(cli, `No command provided.`);
  }

  const command = commands.shift()!.toString();

  if (cli[command] == undefined) {
    displayHelp(cli, `Command "${command}" doesn't exist.`);
  }

  if (typeof cli[command] == "object") {
    return runCommand(commands, cli[command]);
  }

  if (cli[command].length != commands.length) {
    displayHelp(cli[command], `Wrong usage of command "${command}".`);
  }

  return { command: cli[command], args: commands };
}
