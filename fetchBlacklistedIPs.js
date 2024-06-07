const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function fetchBlacklistedIPs() {
 
  // const API_KEY = 'e0769b72dcd4de0e37dc3714244c2991a534f54ed4bb5fd63ff0e5014c751507ef6bc1a0ecdfada2'; 
   try {
  //   //After hitting this endpoint 5 times in a day it ret
  //   //uncomment for getting the AbuseIPAPI blacklisted IP address list.urns status code 429 too many requests.
  //   const response = await axios.get('https://api.abuseipdb.com/api/v2/blacklist', {
  //     params: {
  //       limit: '500000'
  //     },
  //     headers: {
  //       'Accept': 'text/plain',
  //       'Key':API_KEY
  //     }
  //   });

  //   if (response.status !== 200) {
  //     throw new Error('Network response was not ok ' + response.statusText);
  //   }

  //   var ipList = response.data.split('\n');
    var ipList = ["203.159.92.150", "3.157.57.75","18.222.227.254","43.134.63.221","217.86.193.202","201.77.115.9","189.18.212.209","218.92.0.32","189.127.173.52","125.91.114.124", "43.155.174.208"];

    const filePath = path.join(__dirname, 'blocked-ips.txt');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
  }
    fs.writeFileSync(filePath, ipList.join('\n'), 'utf8');
    console.log(`Successfully wrote ${ipList.length} IPs to blocked-ips.txt`);

  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

module.exports = { fetchBlacklistedIPs };