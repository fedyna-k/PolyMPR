export type CLICommand = (...args: Array<string>) => void;
export type CLIAsyncCommand = (...args: Array<string>) => Promise<void>;
export interface CLI {
  [command: string]: CLI | CLICommand | CLIAsyncCommand;
}

/**
 * Display the help message for the CLI.
 * @param cli The CLI (sub-)configuration object.
 * @param errorMessage The error message to display.
 */
export function displayHelp(
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

/**
 * Display object help recursivelly.
 * @param cli The CLI (sub-)configuration object.
 * @param loggingFunction The logging function to use.
 * @param level The tab level.
 */
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

/**
 * Display function help.
 * @param cli The CLI function.
 * @param loggingFunction The logging function to use.
 * @param level The tab level.
 */
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
