import React from 'react';
import { Box, Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import { logResult } from '../utils/logger';
import ora from 'ora';

interface CheckDNSSECProps {
  domain: string;
}

const CheckDNSSEC: React.FC<CheckDNSSECProps> = ({ domain }) => {
  React.useEffect(() => {
    const spinner = ora(`Checking DNSSEC for ${domain}`).start();
    const result = executeCommand(`dig +dnssec +short ${domain}`);
    spinner.succeed(`Checked DNSSEC for ${domain}`);
    logResult(`DNSSEC security extensions for ${domain}`, result);
  }, [domain]);

  return (
    <Box marginBottom={1}>
      <Text bold color="blue">
        DNSSEC for {domain}
      </Text>
    </Box>
  );
};

export default CheckDNSSEC;
