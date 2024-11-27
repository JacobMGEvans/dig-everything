import React, { useState, useCallback } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import DNSRecords from './DNSRecords';
import CNAMERecords from './CNAMERecords';
import TraceDNSPath from './TraceDNSPath';
import CheckDNSSEC from './CheckDNSSEC';
import SSLInfo from './SSLInfo';
import WhoisInfo from './WhoIsInfo';
import SPFRecord from './SPFRecords';
import DomainKeys from './DomainKeys';
import enquirer from 'enquirer';

export const subdomains = [
  'accounts',
  'clerk',
  'clk._domainkey',
  'clk2._domainkey',
  'clkmail',
];
const App: React.FC = () => {
  const { exit } = useApp();
  const [domain, setDomain] = useState<string>('');

  const promptDomain = useCallback(async () => {
    await enquirer
      .prompt<{ domain: string }>({
        type: 'input',
        name: 'domain',
        message: 'Enter the domain to analyze:',
        validate: (value) => (value ? true : 'Domain cannot be empty.'),
      })
      .then((response) => {
        setDomain(response.domain);
      });
  }, []);
  promptDomain();

  useInput((input, key) => {
    if ((key.ctrl && input === 'c') || key.escape) {
      exit();
      return process.exit(0);
    }
  });

  if (!domain) {
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold underline color="green">
        Dig Everything CLI
      </Text>

      {/* Domain Keys */}
      <DomainKeys domain={domain} />

      {/* DNS Records */}
      {['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CAA'].map((type) => (
        <DNSRecords key={type} type={type} domain={domain} />
      ))}

      {/* CNAME Records */}
      {subdomains.length > 0 && (
        <CNAMERecords domain={domain} subdomains={subdomains} />
      )}

      {/* Trace DNS Path */}
      <TraceDNSPath domain={domain} />

      {/* Check DNSSEC */}
      <CheckDNSSEC domain={domain} />

      {/* SSL/TLS Info */}
      <SSLInfo domain={domain} />

      {/* WHOIS Information */}
      <WhoisInfo domain={domain} />

      {/* SPF Record */}
      <SPFRecord domain={domain} />

      <Box marginTop={1}>
        <Text bold color="greenBright">
          Completed!
        </Text>
      </Box>
    </Box>
  );
};

export default App;
