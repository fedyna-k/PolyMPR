import { type ParseOptions } from "@std/cli/parse-args";
import { createModule } from "$root/toolbox/module/create.ts";
import { listModules } from "$root/toolbox/module/list.ts";
import { CLI, displayHelp } from "$root/toolbox/cli/help.ts";
import { main } from "$root/toolbox/cli/main.ts";

/**
 * CLI will use `args._`, but you can define options for global CLI.
 */
const argSpec: ParseOptions = {};

/**
 * Configure CLI commands here.
 */
const cli: CLI = {
  help: () => displayHelp(cli),
  module: {
    list: () => listModules(),
    create: (name: string) => createModule(name),
  },
};

main(cli, argSpec);
