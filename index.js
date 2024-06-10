const { getOS } = require('./src/detectOS');
const { blockIP: windowsBlockIP } = require('./src/blockerWindows');
const { blockIPLinux: linuxBlockIP } = require('./src/blockerLinux');
const { fetchBlacklistedIPs } = require('./src/fetchBlacklistedIPs');
const findSpecificIP = require('./src/findSpecificIP');
const fs = require('fs');
const path = require('path');

const blockIPs = async (pathToCommunicationHistoryFile, numberOfDaysAgo) => {
    fetchBlacklistedIPs().then(() => {
        // pathToCommunicationHistoryFile = 'test.txt';
        // numberOfDaysAgo = 6;
        const filePath = path.join(__dirname, 'blocked-ips.txt');
        const data = fs.readFileSync(filePath, 'utf8');
        const ipList = data.split('\n').filter(ip => ip.trim() !== '');
        let os = getOS();
         // Block IPs based on OS
        if (os === 'Windows') {
            ipList.forEach(windowsBlockIP);
        } else if (os === 'Linux') {
            ipList.forEach(linuxBlockIP);
        }

        if(pathToCommunicationHistoryFile != undefined && pathToCommunicationHistoryFile != ''){
            if(numberOfDaysAgo == undefined || numberOfDaysAgo < 1 ){
                numberOfDaysAgo = 1;
            }
            ipList.forEach(ip => {
                findSpecificIP(pathToCommunicationHistoryFile, ip, numberOfDaysAgo);
            });
        }
        
        // Listen for changes in blocked-ips.txt
        const watchFile = 'blocked-ips.txt';
        let debounceTimeout;
        fs.watch(watchFile, (eventType, filename) => {
            if (filename && eventType === 'change') {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    fs.readFile(watchFile, 'utf8', (err, data) => {
                        if (err) {
                            console.error(`Error reading file: ${err}`);
                            return;
                        }
                        const newIPs = data.split('\n').filter(ip => ip);
                        newIPs.forEach(ip => {
                            if (os === 'Windows') {
                                windowsBlockIP(ip);
                            } else if (os === 'Linux') {
                                linuxBlockIP(ip);
                            }
                        });
                    });
                }, 1000);
            }
        });
        console.log(`${os} IP blocker is running...`);
    }); 
    
};

const pathToCommunicationHistoryFile = process.argv[2];
const numberOfDaysAgo = process.argv[3];
blockIPs(pathToCommunicationHistoryFile,numberOfDaysAgo);