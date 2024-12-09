import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import tls from 'tls';

interface SSLInfoProps {
  domain: string;
}

const SSLInfo: React.FC<SSLInfoProps> = ({ domain }) => {
  const [result, setResult] = useState('');

  useEffect(() => {
    (async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          const socket = tls.connect(
            { host: domain, port: 443, servername: domain },
            () => {
              const cert = socket.getPeerCertificate();
              if (!cert || !Object.keys(cert).length) {
                reject('No certificate retrieved');
              } else {
                setResult(
                  `Subject: ${cert.subject.CN}\nIssuer: ${cert.issuer.CN}\nValid From: ${cert.valid_from}\nValid To: ${cert.valid_to}`
                );
                resolve();
              }
              socket.end();
            }
          );

          socket.on('error', (err) =>
            reject(`SSL connection error: ${err.message}`)
          );
        });
      } catch (err) {
        setResult(String(err));
      }
    })();
  }, []);

  return <Text>{result}</Text>;
};

export default SSLInfo;
