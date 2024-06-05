// Function to block an IP using iptables
function blockIPLinux (ip){ 
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
};
module.exports = { blockIPLinux };