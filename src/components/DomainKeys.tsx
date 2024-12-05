import React from 'react';
import { Box, Text } from 'ink';
import ora from 'ora';

interface DomainKeysProps {
  domain: string;
}

const DomainKeys: React.FC<DomainKeysProps> = ({ domain }) => {
  const [result, setResult] = React.useState<string>('');

  React.useLayoutEffect(() => {
    const spinner = ora(`Checking publishable keys for ${domain}`).start();
    (async () => {
      const result = await fetch(`https://${domain}`);
      setResult(await result.text());
    })();

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
