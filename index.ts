import { execSync } from 'child_process';

function getRecords(type: string, domain: string) {
  console.log(`Getting ${type} records for ${domain}...`);
  try {
    const result = execSync(`dig +noall +answer ${domain} ${type}`).toString();
    if (result.trim() === '') {
      console.log(`No ${type} records found for ${domain}.`);
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error(`Error getting ${type} records: ${error}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`Usage: ${process.argv[1]} <domain>`);
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

  console.log(`Starting checks for CNAME records for ${DOMAIN}`);
  SUBDOMAINS.forEach((SUB) => {
    console.log(`Checking CNAME record for ${SUB}.${DOMAIN}`);
    try {
      const cnameResult = execSync(
        `dig +noall +answer ${SUB}.${DOMAIN} CNAME`
      ).toString();
      if (cnameResult.trim() === '') {
        console.log(`No CNAME record found for ${SUB}.${DOMAIN}.`);
      } else {
        console.log(cnameResult);
      }
    } catch (error) {
      console.error(
        `Error checking CNAME record for ${SUB}.${DOMAIN}: ${error}`
      );
    }
  });

  console.log(`Trace path packets for ${DOMAIN}`);
  try {
    const traceResult = execSync(`dig +trace ${DOMAIN}`).toString();
    console.log(traceResult);
  } catch (error) {
    console.error(`Error tracing path packets: ${error}`);
  }

  console.log(`DNSSEC security extensions for ${DOMAIN}`);
  try {
    const dnssecResult = execSync(`dig +dnssec ${DOMAIN}`).toString();
    console.log(dnssecResult);
  } catch (error) {
    console.error(`Error with DNSSEC security extensions: ${error}`);
  }

  console.log('Completed!');
}

main();
