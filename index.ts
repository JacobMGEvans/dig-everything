import { execSync } from 'child_process';
import chalk from 'chalk';

function getRecords(type: string, domain: string) {
  console.log(chalk.bold.blue(`Getting ${type} records for ${domain}`));
  try {
    const result = execSync(`dig +noall +answer ${domain} ${type}`).toString();
    if (result.trim() === '') {
      console.log(chalk.red(`No ${type} records found for ${domain}`));
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

  const domain = args[0];
  const subdomains = [
    'accounts',
    'clerk',
    'clk._domainkey',
    'clk2._domainkey',
    'clkmail',
  ];

  getRecords('A', domain);
  getRecords('AAAA', domain);
  getRecords('MX', domain);
  getRecords('NS', domain);
  getRecords('TXT', domain);
  getRecords('SOA', domain);

  console.log(
    chalk.bold.blue(`Starting checks for CNAME records for ${domain} \n`)
  );
  subdomains.forEach((sub) => {
    console.log(chalk.bold.blue(`Checking CNAME record for ${sub}.${domain}`));
    try {
      const cnameResult = execSync(
        `dig +noall +answer ${sub}.${domain} CNAME`
      ).toString();
      if (cnameResult.trim() === '') {
        console.log(chalk.red(`No CNAME record found for ${sub}.${domain}`));
      } else {
        console.log(chalk.green(cnameResult));
      }
    } catch (err) {
      console.error(
        chalk.red(`Error checking CNAME record for ${sub}.${domain}: ${err}`)
      );
    }
  });

  console.log(chalk.bold.blue(`Trace path packets for ${domain}`));
  try {
    const traceResult = execSync(`dig +trace ${domain}`).toString();
    console.log(chalk.green(traceResult));
  } catch (err) {
    console.error(chalk.red(`Error tracing path packets: ${err}`));
  }

  console.log(chalk.bold.blue(`DNSSEC security extensions for ${domain}`));
  try {
    const dnssecResult = execSync(`dig +dnssec ${domain}`).toString();
    console.log(chalk.green(dnssecResult));
  } catch (err) {
    console.error(chalk.red(`Error with DNSSEC security extensions: ${err}`));
  }

  console.log(chalk.bold.blue('SSL/TLS Certificate Information:'));
  try {
    const sslResult = execSync(
      // 2>/dev/null -> dumps stdout to /dev/null
      // grep -E '^(depth|verify|subject|issuer)' -> only show depth, verify, subject, issuer and no keys
      `openssl s_client -servername ${domain} -connect ${domain}:443 2>/dev/null | grep -E '^(depth|verify|subject|issuer)'`
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
