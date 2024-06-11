// Function to block an IP using iptables
const { exec } = require('child_process');
function blockIPLinux (ip){ 
  // Add logging rules to iptables
  exec('sudo iptables -A INPUT -m state --state NEW -j LOG --log-prefix "New Connection: "', (inputLogError, inputLogStdout, inputLogStderr) => {
    if (inputLogError) {
      console.error(`Error adding logging rule to INPUT chain: ${inputLogError.message}`);
      return;
    }
    if (inputLogStderr) {
      console.error(`stderr: ${inputLogStderr}`);
      return;
    }
    console.log('Added logging rule to INPUT chain');

    exec('sudo iptables -A OUTPUT -m state --state NEW -j LOG --log-prefix "Outgoing Connection: "', (outputLogError, outputLogStdout, outputLogStderr) => {
      if (outputLogError) {
        console.error(`Error adding logging rule to OUTPUT chain: ${outputLogError.message}`);
        return;
      }
      if (outputLogStderr) {
        console.error(`stderr: ${outputLogStderr}`);
        return;
      }
      console.log('Added logging rule to OUTPUT chain');

      // Check if IP is already blocked
      exec(`sudo iptables -L -n | grep ${ip}`, (listError, listStdout, listStderr) => {
        if (listError && !listError.message.includes('grep')) {
          console.error(`Error listing iptables rules: ${listError.message}`);
          return;
        }
        if (listStderr) {
          console.error(`stderr: ${listStderr}`);
          return;
        }

        const ruleExists = listStdout.includes(ip);
        if (ruleExists) {
          console.log(`IP ${ip} is already blocked.`);
        } else {
          // Block inbound traffic from IP
          exec(`sudo iptables -A INPUT -s ${ip} -j DROP`, (inboundError, inboundStdout, inboundStderr) => {
            if (inboundError) {
              console.error(`Error blocking inbound IP ${ip}: ${inboundError.message}`);
              return;
            }
            if (inboundStderr) {
              console.error(`stderr: ${inboundStderr}`);
              return;
            }
            console.log(`Blocked Inbound IP: ${ip}`);
          });

          // Block outbound traffic to IP
          exec(`sudo iptables -A OUTPUT -d ${ip} -j DROP`, (outboundError, outboundStdout, outboundStderr) => {
            if (outboundError) {
              console.error(`Error blocking outbound IP ${ip}: ${outboundError.message}`);
              return;
            }
            if (outboundStderr) {
              console.error(`stderr: ${outboundStderr}`);
              return;
            }
            console.log(`Blocked Outbound IP: ${ip}`);
          });
        }
      });
    });
  });
};
module.exports = { blockIPLinux };