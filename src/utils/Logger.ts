import chalk from 'chalk';

/*
 * Chalk 5 has changed to ESM.  If we want to use Chalk with TypeScript,
 * we need to probably use Chalk 4 for now.
 */

export default class Logger {
  public static log = (...args: unknown[]) => this.info(args);

  public static info(...args: unknown[]) {
    console.log(
      // prettier-ignore
      chalk.blue(`[${new Date().toLocaleString()}] [INFO] `),
      args.length === 1 && typeof args[0] === 'string' ? chalk.blueBright(args[0]) : args
    );
  }

  public static warn(...args: unknown[]) {
    console.log(
      // prettier-ignore
      chalk.yellow(`[${new Date().toLocaleString()}] [WARNING] `),
      args.length === 1 && typeof args[0] === 'string' ? chalk.yellowBright(args[0]) : args
    );
  }

  public static error(...args: unknown[]) {
    console.log(
      // prettier-ignore
      chalk.red(`[${new Date().toLocaleString()}] [ERROR] `),
      args.length === 1 && typeof args[0] === 'string' ? chalk.redBright(args[0]) : args
    );
  }
}
