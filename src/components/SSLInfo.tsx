import React from 'react';
import { Box, Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import { logResult } from '../utils/logger';
import ora from 'ora';

interface SSLInfoProps {
  domain: string;
}

const SSLInfo: React.FC<SSLInfoProps> = ({ domain }) => {
  React.useEffect(() => {
    const spinner = ora(`Retrieving SSL/TLS Certificate for ${domain}`).start();
    const result = executeCommand(
      `openssl s_client -servername ${domain} -connect ${domain}:443 2>/dev/null | grep -E '^(depth|verify|subject|issuer)'`
    );
    if (result) {
      logResult(`SSL/TLS certificate information for ${domain}`, result);
      spinner.succeed(`Retrieved SSL/TLS Certificate for ${domain}`);
    } else {
      logResult(
        `SSL/TLS certificate information for ${domain}`,
        'Error retrieving SSL info.'
      );
      spinner.fail(`Failed to retrieve SSL/TLS Certificate for ${domain}`);
    }
  }, [domain]);

  return (
    <Box marginBottom={1}>
      <Text bold color="blue">
        SSL/TLS Certificate for {domain}
      </Text>
    </Box>
  );
};

export default SSLInfo;
