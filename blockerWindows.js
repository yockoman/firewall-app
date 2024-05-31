const { exec } = require('child_process');

// List of IPs to block
const blockedIPs = ['192.168.1.100', '192.168.1.101'];

// Function to block an IP using netsh
const blockIP = (ip) => {
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

// Block all IPs in the list
blockedIPs.forEach(blockIP);

// Listen for changes (e.g., a file with new IPs to block)
const fs = require('fs');
const watchFile = 'blocked-ips.txt';

fs.watch(watchFile, (eventType, filename) => {
  if (filename && eventType === 'change') {
    fs.readFile(watchFile, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        return;
      }
      const newIPs = data.split('\n').filter(ip => ip);
      newIPs.forEach(blockIP);
    });
  }
});

console.log('IP blocker is running...');
