// import React from 'react';
// import { Box, Text } from 'ink';
// import { executeCommand } from '../utils/executeCommand';
// import { logResult } from '../utils/logger';
// import ora from 'ora';

// interface ReverseDNSProps {
//   ip: string;
// }

// const ReverseDNS: React.FC<ReverseDNSProps> = ({ ip }) => {
//   React.useEffect(() => {
//     const spinner = ora(`Performing reverse DNS lookup for ${ip}`).start();
//     const result = executeCommand(`dig +noall +answer -x ${ip}`);
//     spinner.succeed(`Performed reverse DNS lookup for ${ip}`);
//     logResult(`Reverse DNS records for ${ip}`, result);
//   }, [ip]);

//   return (
//     <Box marginBottom={1}>
//       <Text bold color="blue">
//         Reverse DNS Lookup for {ip}
//       </Text>
//     </Box>
//   );
// };

// export default ReverseDNS;
