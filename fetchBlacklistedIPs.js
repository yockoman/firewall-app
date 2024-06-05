// const fetch = require('node-fetch');
// const fs = require('fs');
// const path = require('path');

function fetchBlacklistedIPs() {
  try {
    //const { default: fetch } = await import('node-fetch');

    var a =12345;
    console.log(a);
    const response = fetch('https://api.example.com/blacklisted-ips', {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = response.json();
    const ipList = data.blacklisted_ips;

    const filePath = path.join(__dirname, 'blocked-ips.txt');
    fs.writeFileSync(filePath, ipList.join('\n'), 'utf8');
    console.log(`Successfully wrote ${ipList.length} IPs to blocked-ips.txt`);

  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

module.exports = { fetchBlacklistedIPs };