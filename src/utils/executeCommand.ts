import { execSync } from 'child_process';
import ora from 'ora';

export function executeCommand(command: string): string {
  const spinner = ora(`Executing: ${command}`).start();

  try {
    const result = execSync(command, { encoding: 'utf-8' }).trim();
    spinner.succeed(`Executed: ${command}`);
    return result;
  } catch (error: any) {
    spinner.fail(`Error executing command: ${command}\n${error.message}`);
    return '';
  }
}
