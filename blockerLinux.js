// Function to block an IP using iptables
function blockIPLinux (ip){ 
  exec('sudo iptables -L INPUT -v -n', (listError, listStdout, listStderr) => {
    if (listError) {
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
      // Add the rule to block the IP if it doesn't already exist
      exec(`sudo iptables -A INPUT -s ${ip} -j DROP`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error blocking IP ${ip}: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`Blocked IP: ${ip}`);
      });
    }
  });
};
module.exports = { blockIPLinux };