const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function fetchBlacklistedIPs() {
 
   const API_KEY = '' //your AbuseIP API key; 
   try {
    var ipList;
    //After hitting this endpoint 5 times in a day it returns status code 429 too many requests.
    //uncomment for getting the AbuseIPAPI blacklisted IP address list.
    //await axios.get('https://api.abuseipdb.com/api/v2/blacklist', {
    await axios.get('http://localhost:3000', {
      params: {
        limit: '500000'
      },
      headers: {
        'Accept': 'text/plain',
        'Key':API_KEY
      }
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      var ipList = response.data.split('\n');
      const filePath = path.join(__dirname, 'blocked-ips.txt');
      
      //create blocked-ips.txt file if it doesn't exist.
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
      }
      fs.writeFileSync(filePath, ipList.join('\n'), 'utf8');
      console.log(`Successfully wrote ${ipList.length} IPs to blocked-ips.txt`);
    });
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

module.exports = { fetchBlacklistedIPs };