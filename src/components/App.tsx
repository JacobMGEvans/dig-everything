import React, { useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { DNSRecords } from './DNSRecords';
import { CNAMERecords } from './CNAMERecords';
import { SSLInfo } from './SSLInfo';
// import TraceDNSPath from './TraceDNSPath';
// import CheckDNSSEC from './CheckDNSSEC';
// import WhoisInfo from './WhoIsInfo';
// import SPFRecord from './SPFRecords';
import DomainKeys from './DomainKeys';
import enquirer from 'enquirer';

export const subdomains = [
  'accounts',
  'clerk',
  'clk._domainkey',
  'clk2._domainkey',
  'clkmail',
];
export const COLUMN_WIDTHS = {
  titleRow: 20,
  row1: 50,
  row2: 50,
};

const App: React.FC = () => {
  const { exit } = useApp();
  const [domain, setDomain] = useState<string>('');

  React.useMemo(() => {
    (async () => {
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
    })();
  }, []);

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

      {['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CAA'].map((recordType) => (
        <DNSRecords key={recordType} recordType={recordType} domain={domain} />
      ))}
      <DomainKeys domain={domain} />
      {<CNAMERecords domain={domain} subdomains={subdomains} />}
      <SSLInfo domain={domain} />
      {/* 
       <TraceDNSPath domain={domain} />
      <CheckDNSSEC domain={domain} />
      <WhoisInfo domain={domain} />
      <SPFRecord domain={domain} /> */}
      <Box marginTop={1}>
        <Text bold color="greenBright">
          Completed!
        </Text>
      </Box>
    </Box>
  );
};

export default App;
