import React from 'react';
import { Box, Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import { logResult } from '../utils/logger';
import ora from 'ora';

interface WhoisInfoProps {
  domain: string;
}

const WhoisInfo: React.FC<WhoisInfoProps> = ({ domain }) => {
  React.useLayoutEffect(() => {
    const spinner = ora(`Fetching WHOIS information for ${domain}`).start();
    const result = executeCommand(`whois ${domain}`);
    spinner.succeed(`Fetched WHOIS information for ${domain}`);
    logResult(`WHOIS information for ${domain}`, result);
  }, []);

  return (
    <Box marginBottom={1}>
      <Text bold color="blue">
        WHOIS Information for {domain}
      </Text>
    </Box>
  );
};

export default WhoisInfo;
