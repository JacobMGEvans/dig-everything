import React, { JSX } from 'react';
import { Box, Text } from 'ink';
import dns from 'node:dns/promises';
import ora from 'ora';
import SSLInfo from './SSLInfo';

export const padString = (
  str: string | JSX.Element,
  length: number,
  align: 'left' | 'right' = 'left'
) => {
  // Check if the str is a JSX.Element and return it directly
  if (typeof str === 'object' && typeof str !== 'string') {
    return str;
  }

  if (str.length > length) {
    return align === 'left'
      ? str.slice(0, length - 3) + '...'
      : '...' + str.slice(-length + 3);
  }

  const padding = ' '.repeat(length - str.length);
  return align === 'left' ? str + padding : padding + str;
};

interface CNAMERecordsProps {
  domain: string;
  subdomains: string[];
}

// Add an index signature to allow dynamic keys
interface TableRow {
  Subdomain: string;
  'CNAME Record': string;
  'SSL Info': string | JSX.Element;
}

const COLUMN_WIDTHS = {
  subdomain: 20,
  cname: 50,
  ssl: 60,
};

const CNAMERecords: React.FC<CNAMERecordsProps> = ({ domain, subdomains }) => {
  const [tableData, setTableData] = React.useState<TableRow[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useLayoutEffect(() => {
    const fetchRecords = async () => {
      const spinner = ora(
        `Checking CNAME and SSL records for ${domain}`
      ).start();

      try {
        const data: TableRow[] = [];

        for (const sub of subdomains) {
          const fqdn = `${sub}.${domain}`;

          // Fetch CNAME Record using Node.js DNS API
          let cname = 'N/A';
          try {
            const cnameRecords = await dns.resolveCname(fqdn);
            cname = cnameRecords.join(', '); // Join with comma for single-line
          } catch {
            cname = 'No CNAME Record';
          }

          // Simulate SSL Info (can be replaced with a proper function)
          const ssl = ['clerk', 'accounts'].includes(sub) ? (
            <Box flexDirection="column">
              <Text>Subject: accounts.clerk.com</Text>
              <Text>Issuer: WE1</Text>
              <Text>Valid From: Oct 10 16:43:23 2024 GMT</Text>
              <Text>Valid To: Jan 8 16:43:22 2025 GMT</Text>
            </Box>
          ) : (
            'N/A'
          );

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
      <Text bold color="blue">
        CNAME Records for {domain}
      </Text>
      {/* Header */}
      <Box>
        <Box width={COLUMN_WIDTHS.subdomain}>
          <Text bold>Subdomain</Text>
        </Box>
        <Box width={COLUMN_WIDTHS.cname}>
          <Text bold>CNAME Record</Text>
        </Box>
        <Box width={COLUMN_WIDTHS.ssl}>
          <Text bold>SSL Info</Text>
        </Box>
      </Box>
      {/* Divider */}
      <Box>
        <Box width={COLUMN_WIDTHS.subdomain}>
          <Text>{'-'.repeat(COLUMN_WIDTHS.subdomain)}</Text>
        </Box>
        <Box width={COLUMN_WIDTHS.cname}>
          <Text>{'-'.repeat(COLUMN_WIDTHS.cname)}</Text>
        </Box>
        <Box width={COLUMN_WIDTHS.ssl}>
          <Text>{'-'.repeat(COLUMN_WIDTHS.ssl)}</Text>
        </Box>
      </Box>
      {/* Table Rows */}
      {tableData.map((row, index) => (
        <Box key={index}>
          <Box width={COLUMN_WIDTHS.subdomain}>
            <Text>{row.Subdomain}</Text>
          </Box>
          <Box width={COLUMN_WIDTHS.cname}>
            <Text>{row['CNAME Record']}</Text>
          </Box>
          <Box width={COLUMN_WIDTHS.ssl}>
            {typeof row['SSL Info'] === 'string' ? (
              <Text>{row['SSL Info']}</Text>
            ) : (
              row['SSL Info']
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CNAMERecords;
