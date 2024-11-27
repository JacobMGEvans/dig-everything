import { execSync } from 'child_process';
import ora from 'ora';

export function executeCommand(command: string): string {
  try {
    const spinner = ora(`Executing: ${command}`).start();
    const result = execSync(command).toString().trim();
    spinner.succeed(`Executed: ${command}`);
    return result;
  } catch (err: any) {
    ora().fail(`Error executing command: ${command}\n${err.message}`);
    return '';
  }
}
