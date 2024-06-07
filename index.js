const { getOS } = require('./detectOS');
const { blockIP: windowsBlockIP } = require('./blockerWindows');
const { blockIPLinux: linuxBlockIP } = require('./blockerLinux');
const { fetchBlacklistedIPs } = require('./fetchBlacklistedIPs');
const interval = 24 * 60 * 60 * 1000; // 24 hours

const blockIPs = async () => {
    let os = getOS();
    const fs = require('fs');
    const path = require('path');

    await fetchBlacklistedIPs(); 
    //setInterval(fetchBlacklistedIPs, interval); //uncomment for this to be executed every 24 hours
    const filePath = path.join(__dirname, 'blocked-ips.txt');
    const data = fs.readFileSync(filePath, 'utf8');
    const ipList = data.split('\n').filter(ip => ip.trim() !== '');
    

    // Block IPs based on OS
    if (os === 'Windows') {
        ipList.forEach(windowsBlockIP);
    } else if (os === 'Linux') {
        ipList.forEach(linuxBlockIP);
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
};

blockIPs();