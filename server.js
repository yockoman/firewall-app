const express = require('express');
const app = express();
const port = 3000;

const getIPAddresses = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
            [
                '185.220.100.242',
                '113.31.112.144',
                '51.79.68.96',
                '138.68.9.83',
                '124.239.150.244',
                '124.156.213.51',
                '43.163.245.191',
                '218.92.0.94',
                '185.100.53.120',
                '170.106.168.186',
                '80.244.11.121',
                '43.156.14.158',
                '222.102.14.163',
                '218.92.0.56',
                '117.232.111.250',
                '45.7.73.125',
                '43.153.192.241',
                '43.134.63.206',
                '157.230.40.249',
                '91.191.220.102',
                '61.177.172.179',
                '123.31.29.19',
                '192.168.1.6',
                '192.168.1.4',
                '192.168.1.255'
            ]
        ); // Example IPs
      }, 1000); // Simulating an async delay
    });
  };
  
  app.get('/', async (req, res) => {
    try {
      const ipAddresses = await getIPAddresses();
      res.send(ipAddresses.join('\n'));
    } catch (error) {
      res.status(500).send('Error fetching IP addresses');
    }
  });
  

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
