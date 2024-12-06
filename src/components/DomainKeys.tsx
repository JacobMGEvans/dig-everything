import React from 'react';
import { Box, Text } from 'ink';
import ora from 'ora';

interface DomainKeysProps {
  domain: string;
}

const DomainKeys: React.FC<DomainKeysProps> = ({ domain }) => {
  const [result, setResult] = React.useState<
    | string
    | { publishableKey: string; clerkKeyPrefix: string; encodedDomain: string }
  >('');
  const [decrypted, setDecrypted] = React.useState<string>('');

  React.useLayoutEffect(() => {
    const spinner = ora(`Checking publishable keys for ${domain}`).start();
    (async () => {
      const result = await fetch(`https://${domain}`);
      if (!result.ok) {
        setResult(`Failed to fetch ${domain}`);
        return;
      }
      const website = await result.text();
      const clerkKeyRegex = /\bpk_(?:live|test)_[a-zA-Z0-9.=]{28,}\b/g;
      const publishableKey = website.match(clerkKeyRegex)?.at(0)?.trim();
      console.log('PUBLISHABLE KEY', publishableKey);

      if (!publishableKey) {
        setResult(`No publishable key found`);
        return;
      }

      const clerkKeyPrefix = publishableKey.slice(0, 8);
      const encodedDomain = publishableKey.replace(clerkKeyPrefix, '');
      setResult({
        publishableKey,
        clerkKeyPrefix,
        encodedDomain,
      });
      setDecrypted(
        Buffer.from(encodedDomain, 'base64').toString().replace('$', '')
      );
    })();

    if (result) {
      spinner.succeed(`Checked publishable keys for ${domain}`);
    } else {
      spinner.fail(`No publishable keys found for ${domain}`);
    }
  }, []);

  return typeof result === 'object' ? (
    <Box marginBottom={1} flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="blue">
          Keys for {domain}
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text bold>Clerk Key Prefix:</Text>
        <Text>{result.clerkKeyPrefix}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text bold>Encoded Domain:</Text>
        <Text>{result.encodedDomain}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text bold>Decrypted:</Text>
        <Text>{decrypted}</Text>
      </Box>
    </Box>
  ) : null;
};

export default DomainKeys;
