// Function to block an IP using netsh
const { exec } = require('child_process');
function blockIP (ip) {
  exec('netsh advfirewall firewall show rule name=all', (listError, listStdout, listStderr) => {
    if (listError) {
      console.error(`Error listing firewall rules: ${listError.message}`);
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
      // Add the rule to block the IP if it doesn't already exist
      exec(`netsh advfirewall firewall add rule name="Block ${ip}" dir=in action=block remoteip=${ip}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error blocking IP ${ip}: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`Blocked Inbound IP: ${ip}`);
      });

      exec(`netsh advfirewall firewall add rule name="Block ${ip}" dir=out action=block remoteip=${ip}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error blocking IP ${ip}: ${error.message}`);
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


module.exports = { blockIP };