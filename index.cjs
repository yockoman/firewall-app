const windowsBlocker = require('./blockerWindows.cjs');
const linuxBlocker = require('./blockerLinux.cjs');
const getOS = require('./detectOS.cjs');
const fetchBlacklistedIPs = require('./fetchBlacklistedIPs.cjs');
const { exec } = require('child_process');

// List of IPs to block
const blockedIPs = ['192.168.1.100', '192.168.1.101'];
const interval = 24; // 24 hours

const blockIPs = () => {
        let os =  getOS();

       
        // Block all IPs in the list
        //let blockedIPs = get from API
        if(os == 'Windows'){
            blockedIPs.forEach(windowsBlocker.blockIP);
        }
        else if (os == 'Linux'){
            blockedIPs.forEach(linuxBlocker.blockIPLinux);
        }

        // setInterval(fetchBlacklistedIPs, interval);
        fetchBlacklistedIPs();

        // Listen for changes (e.g., a file with new IPs to block) test commit
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
        console.log(os + 'IP blocker is running...');
    }