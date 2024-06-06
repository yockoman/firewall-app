const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function fetchBlacklistedIPs() {
  const API_KEY = 'e0769b72dcd4de0e37dc3714244c2991a534f54ed4bb5fd63ff0e5014c751507ef6bc1a0ecdfada2'; // Replace with your actual API key

  try {
    const response = await axios.get('https://api.abuseipdb.com/api/v2/blacklist', {
      params: {
        limit: '500000'
      },
      headers: {
        'Accept': 'text/plain',
        'Key':API_KEY
      }
    });

    if (response.status !== 200) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    var ipList = response.data.split('\n');

    const filePath = path.join(__dirname, 'blocked-ips.txt');
    fs.writeFileSync(filePath, ipList.join('\n'), 'utf8');
    console.log(`Successfully wrote ${ipList.length} IPs to blocked-ips.txt`);

  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

module.exports = { fetchBlacklistedIPs };