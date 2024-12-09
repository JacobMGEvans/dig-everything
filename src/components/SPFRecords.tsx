import React from 'react';
import { Box, Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import { logResult } from '../utils/logger';
import ora from 'ora';

type SPFRecordProps = {
  domain: string;
};

export function SPFRecord({ domain }: SPFRecordProps) {
  React.useLayoutEffect(() => {
    const spinner = ora(`Checking SPF record for ${domain}`).start();
    const result = executeCommand(`dig +short ${domain} TXT | grep "v=spf1"`);
    spinner.succeed(`Checked SPF record for ${domain}`);
    logResult(`SPF record for ${domain}`, result);
  }, []);

  return (
    <Box marginBottom={1}>
      <Text bold color="blue">
        SPF Record for {domain}
      </Text>
    </Box>
  );
}
