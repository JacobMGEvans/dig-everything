import { execSync } from 'child_process';
import chalk from 'chalk';

function getRecords(type: string, domain: string) {
  console.log(chalk.bold.blue(`Getting ${type} records for ${domain}`));
  try {
    const result = execSync(`dig +noall +answer ${domain} ${type}`).toString();
    if (result.trim() === '') {
      console.log(chalk.red(`No ${type} records found for ${domain}.`));
    } else {
      console.log(chalk.green(result));
    }
  } catch (err) {
    console.error(chalk.red(`Error getting ${type} records: ${err}`));
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(
      chalk.yellow(
        `Argument missing. Use this format: ${process.argv[1]} <domain>`
      )
    );
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

  console.log(
    chalk.bold.blue(`Starting checks for CNAME records for ${DOMAIN} \n`)
  );
  SUBDOMAINS.forEach((SUB) => {
    console.log(chalk.bold.blue(`Checking CNAME record for ${SUB}.${DOMAIN}`));
    try {
      const cnameResult = execSync(
        `dig +noall +answer ${SUB}.${DOMAIN} CNAME`
      ).toString();
      if (cnameResult.trim() === '') {
        console.log(chalk.red(`No CNAME record found for ${SUB}.${DOMAIN}.`));
      } else {
        console.log(chalk.green(cnameResult));
      }
    } catch (err) {
      console.error(
        chalk.red(`Error checking CNAME record for ${SUB}.${DOMAIN}: ${err}`)
      );
    }
  });

  console.log(chalk.bold.blue(`Trace path packets for ${DOMAIN}`));
  try {
    const traceResult = execSync(`dig +trace ${DOMAIN}`).toString();
    console.log(chalk.green(traceResult));
  } catch (err) {
    console.error(chalk.red(`Error tracing path packets: ${err}`));
  }

  console.log(chalk.bold.blue(`DNSSEC security extensions for ${DOMAIN}`));
  try {
    const dnssecResult = execSync(`dig +dnssec ${DOMAIN}`).toString();
    console.log(chalk.green(dnssecResult));
  } catch (err) {
    console.error(chalk.red(`Error with DNSSEC security extensions: ${err}`));
  }

  console.log(chalk.bold.blue('SSL/TLS Certificate Information:'));
  try {
    const sslResult = execSync(
      // 2>/dev/null -> dumps stdout to /dev/null
      // grep -E '^(depth|verify|subject|issuer)' -> only show depth, verify, subject, issuer and no keys
      `openssl s_client -servername ${DOMAIN} -connect ${DOMAIN}:443 2>/dev/null | grep -E '^(depth|verify|subject|issuer)'`
    );
    console.log(chalk.green(sslResult));
  } catch (error) {
    console.error(
      chalk.red(`Error getting SSL/TLS certificate information: ${error}`)
    );
  }

  console.log(chalk.bold.greenBright('Completed!'));
}

main();
