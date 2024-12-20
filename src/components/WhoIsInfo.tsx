import React from 'react';
import { Box, Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import ora from 'ora';

type WhoisInfoProps = {
  domain: string;
};

export function WhoisInfo({ domain }: WhoisInfoProps) {
  React.useLayoutEffect(() => {
    const spinner = ora(`Fetching WHOIS information for ${domain}`).start();
    const result = executeCommand(`whois ${domain}`);
    spinner.succeed(`Fetched WHOIS information for ${domain}`);
  }, []);

  return (
    <Box marginBottom={1}>
      <Text bold color="blue">
        WHOIS Information for {domain}
      </Text>
    </Box>
  );
}
