import React, { useState, useLayoutEffect } from 'react';
import { Box, Text } from 'ink';
import dns from 'node:dns/promises';

type DNSRecordsProps = {
  recordType: string;
  domain: string;
};

export function DNSRecords({ recordType, domain }: DNSRecordsProps) {
  const [currentRecords, setCurrentRecords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  if (!domain || typeof domain !== 'string') {
    throw new Error('Invalid domain provided. It must be a non-empty string.');
  }

  if (!recordType || typeof recordType !== 'string') {
    throw new Error(
      'Invalid record type provided. It must be a non-empty string.'
    );
  }

  useLayoutEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let records: string[] = [];

        switch (recordType.toUpperCase()) {
          case 'A':
            records = await dns.resolve4(domain);
            setCurrentRecords(records);
            break;
          case 'AAAA':
            records = await dns.resolve6(domain);
            setCurrentRecords(records);
            break;
          case 'CNAME':
            records = await dns.resolveCname(domain);
            setCurrentRecords(records);
            break;
          case 'MX':
            records = (await dns.resolveMx(domain)).map(
              (mx) => `${mx.exchange} (priority: ${mx.priority})`
            );
            setCurrentRecords(records);
            break;
          case 'NS':
            records = await dns.resolveNs(domain);
            setCurrentRecords(records);
            break;
          case 'TXT':
            records = (await dns.resolveTxt(domain)).map((txt) =>
              txt.join('\n')
            ); // Text records
            setCurrentRecords(records);
            break;
          case 'SOA':
            const soa = await dns.resolveSoa(domain);
            records = [
              `NS: ${soa.nsname}, Admin: ${soa.hostmaster}, Serial: ${soa.serial}`,
            ];
            setCurrentRecords(records);
            break;
          case 'SRV':
            records = (await dns.resolveSrv(domain)).map(
              (srv) =>
                `Target: ${srv.name}, Port: ${srv.port}, Priority: ${srv.priority}, Weight: ${srv.weight}`
            );
            setCurrentRecords(records);
            break;
          case 'CAA':
            records = (await dns.resolveCaa(domain)).map(
              (caa) =>
                `Issue: ${caa.issue}, IODEF: ${caa.iodef}, EMAIL: ${caa.contactemail}`
            );
            setCurrentRecords(records);
            break;
          case 'PTR':
            records = await dns.resolvePtr(domain); // Pointer records (reverse DNS)
            setCurrentRecords(records);
            break;
          default:
            throw new Error(`Unsupported DNS record type: ${recordType}`);
        }

        setCurrentRecords(records);
        setError(null);
      } catch (err: any) {
        setError(`Error resolving ${recordType} records: ${err.message}`);
        setCurrentRecords([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Box marginBottom={1} flexDirection="column">
      <Text bold color="blue">
        {recordType} Records for {domain}
      </Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text color="red">{error}</Text>
      ) : currentRecords.length > 0 ? (
        currentRecords.map((record, index) => (
          <Text key={index}>- {record}</Text>
        ))
      ) : (
        <Text>No records found.</Text>
      )}
    </Box>
  );
}
