import React from 'react';
import { Box, Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import { logResult } from '../utils/logger';
import ora from 'ora';

interface TraceDNSPathProps {
  domain: string;
}

const TraceDNSPath: React.FC<TraceDNSPathProps> = ({ domain }) => {
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

    logResult(`Trace summary for ${domain}`, summary);
  }, []);

  return (
    <Box marginBottom={1}>
      <Text bold color="blue">
        Trace DNS Path for {domain}
      </Text>
    </Box>
  );
};

export default TraceDNSPath;
