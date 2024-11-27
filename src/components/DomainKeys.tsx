import React from 'react';
import { Box, Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import ora from 'ora';

interface DomainKeysProps {
  domain: string;
}

const DomainKeys: React.FC<DomainKeysProps> = ({ domain }) => {
  React.useEffect(() => {
    const spinner = ora(`Checking publishable keys for ${domain}`).start();
    const result = executeCommand(`curl -v ${domain} | grep pk_live_`);
    if (result) {
      spinner.succeed(`Checked publishable keys for ${domain}`);
    } else {
      spinner.fail(`No publishable keys found for ${domain}`);
    }
  }, []);

  return (
    <Box marginBottom={1}>
      <Text bold color="blue">
        Publishable Keys for {domain}
      </Text>
    </Box>
  );
};

export default DomainKeys;
