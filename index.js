const { getOS } = require('./detectOS');
const { blockIP: windowsBlockIP } = require('./blockerWindows');
const { blockIPLinux: linuxBlockIP } = require('./blockerLinux');
const { fetchBlacklistedIPs } = require('./fetchBlacklistedIPs');

const blockedIPs = ['192.168.1.101', '192.168.1.102'];
const interval = 24; // 24 hours

const blockIPs = () => {
    let os = getOS();

    // Block IPs based on OS
    if (os === 'Windows') {
        blockedIPs.forEach(windowsBlockIP);
    } else if (os === 'Linux') {
        blockedIPs.forEach(linuxBlockIP);
    }

    setInterval(fetchBlacklistedIPs, interval);
    fetchBlacklistedIPs();

    // Listen for changes in blocked-ips.txt
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
                newIPs.forEach(ip => {
                    if (os === 'Windows') {
                        windowsBlockIP(ip);
                    } else if (os === 'Linux') {
                        linuxBlockIP(ip);
                    }
                });
            });
        }
    });

    console.log(`${os} IP blocker is running...`);
};

blockIPs();