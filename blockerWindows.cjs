// Function to block an IP using netsh
function blockIP (ip) {
  exec(`netsh advfirewall firewall add rule name="Block ${ip}" dir=in action=block remoteip=${ip}`, (error, stdout, stderr) => {
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
};


module.exports = blockIP;