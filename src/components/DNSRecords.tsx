import React from 'react';
import { Box, Text } from 'ink';
import Table from 'ink-table';
import { executeCommand } from '../utils/executeCommand';
import { logResult } from '../utils/logger';

interface DNSRecordsProps {
  type: string;
  domain: string;
}

const DNSRecords: React.FC<DNSRecordsProps> = ({ type, domain }) => {
  React.useEffect(() => {
    const result = executeCommand(`dig +noall +answer ${domain} ${type}`);
    logResult(`${type} records for ${domain}`, result);
  }, [type, domain]);

  return (
    <Box marginBottom={1}>
      <Text bold color="blue">
        {type} Records for {domain}
      </Text>
    </Box>
  );
};

export default DNSRecords;
