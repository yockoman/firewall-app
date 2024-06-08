// Function to block an IP using iptables
const { exec } = require('child_process');
function blockIPLinux (ip){ 
  exec(`iptables -L -n | grep ${ip}`, (listError, listStdout, listStderr) => {
    if (listError && !listError.message.includes("grep")) {
      console.error(`Error listing iptables rules: ${listError.message}`);
      return;
    }
    if (listStderr) {
      console.error(`stderr: ${listStderr}`);
      return;
    }

    // Check if any rule already blocks the given IP
    const ruleExists = listStdout.includes(ip);
    if (ruleExists) {
      console.log(`IP ${ip} is already blocked.`);
    } else {
      // Add the rule to block inbound traffic from the IP if it doesn't already exist
      exec(`iptables -A INPUT -s ${ip} -j DROP`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error blocking inbound IP ${ip}: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`Blocked Inbound IP: ${ip}`);
      });

      // Add the rule to block outbound traffic to the IP if it doesn't already exist
      exec(`iptables -A OUTPUT -d ${ip} -j DROP`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error blocking outbound IP ${ip}: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`Blocked Outbound IP: ${ip}`);
      });
    }
  });
};
module.exports = { blockIPLinux };