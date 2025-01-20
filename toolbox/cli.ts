import { parseArgs, type ParseOptions } from "@std/cli/parse-args";
import { createModule } from "$root/toolbox/module.ts";

interface CLI {
  [command: string]: CLI | (() => void) | (() => Promise<void>);
}

const argSpec: ParseOptions = {};

const cli: CLI = {
  help: () => displayHelp(cli),
  module: {
    create: createModule,
  },
};

function displayHelp(cli: CLI, errorMessage?: string): never {
  const loggingFunction = errorMessage ? console.error : console.log;
  if (errorMessage) {
    console.error(errorMessage);
  }

  loggingFunction("Commands:");

}

function runCommand(commands: Array<string | number>, cli: CLI): never | void | Promise<void> {
  if (commands.length == 0) {
    console.error(
      `No command provided. Available commands are ${
        JSON.stringify(Object.keys(cli))
      }.`,
    );
    Deno.exit(1);
  }

  const command = commands.shift()!.toString();

  if (cli[command] == undefined) {
    console.error(
      `Command "${command}" doesn't exist. Available commands are ${
        JSON.stringify(Object.keys(cli))
      }.`,
    );
    Deno.exit(1);
  }

  if (typeof cli[command] == "object") {
    return runCommand(commands, cli[command]);
  }

  return cli[command]();
}

function main() {
  const args = parseArgs(Deno.args, argSpec);
  runCommand(args._, cli);
}

main();
