import React from 'react';
import { Box, Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import { logResult } from '../utils/logger';
import ora from 'ora';

interface SPFRecordProps {
  domain: string;
}

const SPFRecord: React.FC<SPFRecordProps> = ({ domain }) => {
  React.useEffect(() => {
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
};

export default SPFRecord;
