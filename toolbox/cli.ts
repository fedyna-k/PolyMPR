import { parseArgs, type ParseOptions } from "@std/cli/parse-args";
import { createModule } from "$root/toolbox/module/create.ts";
import { listModules } from "$root/toolbox/module/list.ts";

type CLICommand = (...args: Array<string>) => void;
type CLIAsyncCommand = (...args: Array<string>) => Promise<void>;
interface CLI {
  [command: string]: CLI | CLICommand | CLIAsyncCommand;
}

const argSpec: ParseOptions = {};

const cli: CLI = {
  help: () => displayHelp(cli),
  module: {
    list: () => listModules(),
    create: (name: string) => createModule(name),
  },
};

function displayHelp(
  cli: CLI | CLICommand | CLIAsyncCommand,
  errorMessage?: string,
): never {
  const loggingFunction = errorMessage ? console.error : console.log;
  if (errorMessage) {
    console.error(errorMessage);
  }

  if (typeof cli == "function") {
    loggingFunction("Usage:");
    displayFunctionHelp(cli, loggingFunction);
  } else {
    loggingFunction("Commands:");
    displayObjectHelp(cli, loggingFunction);
  }

  Deno.exit(errorMessage ? 1 : 0);
}

function displayObjectHelp(
  cli: CLI,
  loggingFunction: typeof console.log,
  level: number = 1,
) {
  for (const [key, value] of Object.entries(cli)) {
    if (typeof value == "function") {
      displayFunctionHelp(value, loggingFunction, level);
    } else {
      loggingFunction(`${" ".repeat(level * 2)}${key}`);
      displayObjectHelp(value, loggingFunction, level + 1);
    }
  }
}

function displayFunctionHelp(
  cli: CLICommand | CLIAsyncCommand,
  loggingFunction: typeof console.log,
  level: number = 1,
) {
  const command = cli.name;
  const matched = cli.toString().match(/(?<=^\()[^\)]+(?=\))/);
  const args = matched?.[0].split(",").map((arg) => `<${arg.trim()}>`);
  loggingFunction(
    `${" ".repeat(level * 2)}${command} ${args?.join(" ") ?? ""}`,
  );
}

function runCommand(
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

function main() {
  const argv = parseArgs(Deno.args, argSpec);
  const { command, args } = runCommand(argv._, cli);

  command(...args.map((element) => element.toString()));
}

main();
