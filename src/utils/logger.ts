import chalk from 'chalk';

export function logResult(description: string, result: string) {
  if (result === '') {
    console.log(chalk.red(`${description} not found or an error occurred.`));
  } else {
    console.log(chalk.green(`${description}:\n${result}\n`));
  }
}
