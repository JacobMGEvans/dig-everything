import React from 'react';
import { Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import { logResult } from '../utils/logger';
import ora from 'ora';
import tls from 'tls';

interface SSLInfoProps {
  domain: string;
}

const SSLInfo: React.FC<SSLInfoProps> = ({ domain }) => {
  const [result, setResult] = React.useState<string>('');
  React.useLayoutEffect(() => {
    (async () =>
      await new Promise((resolve, reject) => {
        const options = {
          host: domain,
          port: 443,
          servername: domain,
        };

        const socket = tls.connect(options, () => {
          const cert = socket.getPeerCertificate();
          if (!cert || Object.keys(cert).length === 0) {
            reject('No certificate retrieved');
          } else {
            setResult(
              `Subject: ${cert.subject.CN}\nIssuer: ${cert.issuer.CN}\nValid From: ${cert.valid_from}\nValid To: ${cert.valid_to}`
            );
            resolve('Sucessfully retrieved certificate');
          }
          socket.end();
        });

        socket.on('error', (err) => {
          reject(`SSL connection error: ${err.message}`);
        });
      }))();
  }, []);

  return <Text>{result}</Text>;
};

export default SSLInfo;
