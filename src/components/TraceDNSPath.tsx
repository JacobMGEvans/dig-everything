import React from 'react';
import { Box, Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import ora from 'ora';

type TraceDNSPathProps = {
  domain: string;
};

export function TraceDNSPath({ domain }: TraceDNSPathProps) {
  React.useLayoutEffect(() => {
    const spinner = ora(`Tracing DNS path for ${domain}`).start();
    const result = executeCommand(`dig +trace ${domain}`);
    spinner.succeed(`Traced DNS path for ${domain}`);

    const summary = result
      .split('\n')
      .filter((line: string) =>
        line.match(/^\..*IN\s+NS|com\..*IN\s+NS|.*\.com\..*IN\s+(NS|A)/)
      )
      .map((line: string) => line.trim())
      .join('\n');
  }, []);

  return (
    <Box marginBottom={1}>
      <Text bold color="blue">
        Trace DNS Path for {domain}
      </Text>
    </Box>
  );
}
