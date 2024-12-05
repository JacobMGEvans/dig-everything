import React from 'react';
import { Box, Text } from 'ink';
import { executeCommand } from '../utils/executeCommand';
import { logResult } from '../utils/logger';
import ora from 'ora';
import tls from 'tls';

interface SSLInfoProps {
  domain: string;
}

const SSLInfo: React.FC<SSLInfoProps> = ({ domain }) => {
  const getSSLInfo = React.useCallback(async () => {
    return await new Promise((resolve, reject) => {
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
          resolve(`
            Subject: ${cert.subject.CN}
            Issuer: ${cert.issuer.CN}
            Valid From: ${cert.valid_from}
            Valid To: ${cert.valid_to}
          `);
        }
        socket.end();
      });

      socket.on('error', (err) => {
        reject(`SSL connection error: ${err.message}`);
      });
    });
  }, []);
  getSSLInfo();

  return <Text>SSL/TLS Certificate for {domain}</Text>;
};

export default SSLInfo;
