import { execSync } from 'child_process';
import chalk from 'chalk';

function executeCommand(command: string): string {
  try {
    return execSync(command).toString().trim();
  } catch (err) {
    console.error(chalk.red(`Error executing command: ${command}\n${err}`));
    return '';
  }
}

function logResult(description: string, result: string) {
  if (result === '') {
    console.log(chalk.red(`${description} not found or an error occurred.`));
  } else {
    console.log(chalk.green(result));
  }
}

function getDNSRecords(type: string, domain: string) {
  console.log(chalk.bold.blue(`Getting ${type} records for ${domain}`));
  const result = executeCommand(`dig +noall +answer ${domain} ${type}`);
  logResult(`${type} records for ${domain}`, result);
}

function checkCNAMERecords(domain: string, subdomains: string[]) {
  console.log(chalk.bold.blue(`Checking CNAME records for ${domain}`));
  subdomains.forEach((sub) => {
    console.log(chalk.bold.blue(`CNAME record for ${sub}.${domain}`));
    const result = executeCommand(`dig +noall +answer ${sub}.${domain} CNAME`);
    logResult(`CNAME record for ${sub}.${domain}`, result);
  });
}

function traceDNSPath(domain: string) {
  console.log(chalk.bold.blue(`Tracing DNS path for ${domain}`));

  const result = execSync(`dig +trace ${domain}`).toString();
  const summary = result
    .split('\n')
    .filter((line) =>
      line.match(/^\..*IN\s+NS|com\..*IN\s+NS|.*\.com\..*IN\s+(NS|A)/)
    )
    .map((line) => line.trim())
    .join('\n');

  logResult(`Trace summary for ${domain}`, summary);
}

function checkDNSSEC(domain: string) {
  console.log(
    chalk.bold.blue(`Checking DNSSEC security extensions for ${domain}`)
  );
  const result = executeCommand(`dig +dnssec ${domain}`);
  logResult(`DNSSEC security extensions for ${domain}`, result);
}

function getSSLInfo(domain: string) {
  console.log(chalk.bold.blue('Retrieving SSL/TLS Certificate Information:'));
  const result = executeCommand(
    `openssl s_client -servername ${domain} -connect ${domain}:443 2>/dev/null | grep -E '^(depth|verify|subject|issuer)'`
  );
  logResult('SSL/TLS certificate information', result);
}

// function getReverseDNS(ip: string) {
//   console.log(chalk.bold.blue(`Performing reverse DNS lookup for ${ip}`));
//   const result = executeCommand(`dig +noall +answer -x ${ip}`);
//   logResult(`Reverse DNS records for ${ip}`, result);
// }

function getWhois(domain: string) {
  console.log(chalk.bold.blue(`Getting WHOIS information for ${domain}`));
  const result =
    executeCommand(`whois ${domain} | grep -E 'Domain Name:|Registrar:|Creation Date:|Expiration Date:'
`);
  logResult(`WHOIS information for ${domain}`, result);
}

function checkSPF(domain: string) {
  console.log(chalk.bold.blue(`Checking SPF record for ${domain}`));
  const result = executeCommand(`dig +short ${domain} TXT | grep "v=spf1"`);
  logResult(`SPF record for ${domain}`, result);
}

// function checkOpenPorts(domain: string, ports: number[]) {
//   console.log(chalk.bold.blue(`Checking open ports for ${domain}`));
//   ports.forEach((port) => {
//     const result = executeCommand(`nc -zv ${domain} ${port}`);
//     logResult(`Port ${port} on ${domain}`, result);
//   });
// }

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(
      chalk.bold.red(
        `Argument missing. Use this format: ${process.argv[1]} <domain>`
      )
    );
    process.exit(1);
  }

  const domain = args[0];

  // DNS Records
  getDNSRecords('A', domain);
  getDNSRecords('AAAA', domain);
  getDNSRecords('MX', domain);
  getDNSRecords('NS', domain);
  getDNSRecords('TXT', domain);
  getDNSRecords('SOA', domain);
  getDNSRecords('CAA', domain);

  // CNAME Records
  process.env.subdomains &&
    checkCNAMERecords(
      domain,
      JSON.parse(process.env.subdomains) satisfies string[]
    );

  // Trace and DNSSEC
  traceDNSPath(domain);
  checkDNSSEC(domain);

  // SSL/TLS Info
  getSSLInfo(domain);

  // Additional Tools
  // getReverseDNS('8.8.8.8'); // Replace with the IP address of interest
  getWhois(domain);
  checkSPF(domain);
  // checkOpenPorts(domain, [80, 443]);

  console.log(chalk.bold.greenBright('Completed!'));
}

main();
