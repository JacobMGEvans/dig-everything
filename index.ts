import { execSync } from 'child_process';
import chalk from 'chalk';

function getRecords(type: string, domain: string) {
  console.log(chalk.blue(`Getting ${type} records for ${domain}...`));
  try {
    const result = execSync(`dig +noall +answer ${domain} ${type}`).toString();
    if (result.trim() === '') {
      console.log(chalk.red(`No ${type} records found for ${domain}.`));
    } else {
      console.log(chalk.green(result));
    }
  } catch (error) {
    console.error(chalk.red(`Error getting ${type} records: ${error}`));
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(chalk.yellow(`Usage: ${process.argv[1]} <domain>`));
    process.exit(1);
  }

  const DOMAIN = args[0];
  const SUBDOMAINS = [
    'accounts',
    'clerk',
    'clk._domainkey',
    'clk2._domainkey',
    'clkmail',
  ];

  getRecords('A', DOMAIN);
  getRecords('AAAA', DOMAIN);
  getRecords('MX', DOMAIN);
  getRecords('NS', DOMAIN);
  getRecords('TXT', DOMAIN);
  getRecords('SOA', DOMAIN);

  console.log(chalk.blue(`Starting checks for CNAME records for ${DOMAIN} \n`));
  SUBDOMAINS.forEach((SUB) => {
    console.log(chalk.blue(`Checking CNAME record for ${SUB}.${DOMAIN}`));
    try {
      const cnameResult = execSync(
        `dig +noall +answer ${SUB}.${DOMAIN} CNAME`
      ).toString();
      if (cnameResult.trim() === '') {
        console.log(chalk.red(`No CNAME record found for ${SUB}.${DOMAIN}.`));
      } else {
        console.log(chalk.green(cnameResult));
      }
    } catch (error) {
      console.error(
        chalk.red(`Error checking CNAME record for ${SUB}.${DOMAIN}: ${error}`)
      );
    }
  });

  console.log(chalk.blue(`Trace path packets for ${DOMAIN}`));
  try {
    const traceResult = execSync(`dig +trace ${DOMAIN} \n`).toString();
    console.log(chalk.green(traceResult));
  } catch (error) {
    console.error(chalk.red(`Error tracing path packets: ${error}`));
  }

  console.log(chalk.blue(`DNSSEC security extensions for ${DOMAIN}`));
  try {
    const dnssecResult = execSync(`dig +dnssec ${DOMAIN}`).toString();
    console.log(chalk.green(dnssecResult));
  } catch (error) {
    console.error(chalk.red(`Error with DNSSEC security extensions: ${error}`));
  }

  console.log(chalk.blue('Completed!'));
}

main();
