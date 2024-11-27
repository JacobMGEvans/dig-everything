import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import Table from 'ink-table';
import { executeCommand } from '../utils/executeCommand';
import { logResult } from '../utils/logger';
import ora from 'ora';

interface CNAMERecordsProps {
  domain: string;
  subdomains: string[];
}

// Add an index signature to allow dynamic keys
interface TableRow {
  [key: string]: string;
  Subdomain: string;
  'CNAME Record': string;
  'SSL Info': string;
}

const CNAMERecords: React.FC<CNAMERecordsProps> = ({ domain, subdomains }) => {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      const spinner = ora(
        `Checking CNAME and SSL records for ${domain}`
      ).start();

      try {
        const data: TableRow[] = [];

        for (const sub of subdomains) {
          const fqdn = `${sub}.${domain}`;

          // Fetch CNAME Record
          const cnameCommand = `dig +noall +answer ${fqdn} CNAME`;
          const cnameResult = await executeCommand(cnameCommand);
          logResult(`CNAME record for ${fqdn}`, cnameResult);
          const cname = cnameResult.trim() || 'N/A';

          // Fetch SSL Info if applicable
          let ssl = 'N/A';
          if (['clerk', 'accounts'].includes(sub)) {
            const sslCommand = `openssl s_client -servername ${fqdn} -connect ${fqdn}:443 2>/dev/null | grep -E '^(depth|verify|subject|issuer)'`;
            const sslResult = await executeCommand(sslCommand);
            logResult(`SSL certificate for ${fqdn}`, sslResult);
            ssl = sslResult.trim() || 'N/A';
          }

          data.push({
            Subdomain: sub,
            'CNAME Record': cname,
            'SSL Info': ssl,
          });
        }

        setTableData(data);
        spinner.succeed(`Completed CNAME and SSL checks for ${domain}`);
      } catch (err) {
        spinner.fail(`Error checking records for ${domain}`);
        setError(
          'Failed to retrieve records. Please check your network connection and domain configuration.'
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [domain, subdomains]);

  if (loading) {
    return (
      <Box>
        <Text>Loading CNAME and SSL records for {domain}...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>CNAME and SSL Information for {domain}</Text>
      </Box>
      <Table
        data={tableData}
        // Optional: Customize table styles if needed
        // Example of adding column headers with specific alignment
        // columns={[
        //   { key: 'Subdomain', header: 'Subdomain', alignment: 'left' },
        //   { key: 'CNAME Record', header: 'CNAME Record', alignment: 'left' },
        //   { key: 'SSL Info', header: 'SSL Info', alignment: 'left' },
        // ]}
      />
    </Box>
  );
};

export default CNAMERecords;
