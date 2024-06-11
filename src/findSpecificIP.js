const fs = require('fs');
const readline = require('readline');
const { DateTime } = require('luxon');

/**
 * Finds and prints lines containing a specific IP address within the specified timeframe.
 * 
 * @param {string} filePath - The path to the log file.
 * @param {string} specificIP - The IP address to search for.
 * @param {int} numberOfDaysAgo - The number of days ago to consider.
 */

function findSpecificIP(filePath, specificIP, numberOfDaysAgo) {
    if (!filePath || !specificIP) {
        console.error('Please provide the path to the log file and the specific IP address as arguments.');
        console.error('Usage: findSpecificIP(<path-to-log-file>, <specific-ip-address>, <number-of-days-ago>)');
        return;
    }

    // Define a regular expression to match the specific IP address
    const ipRegex = new RegExp(`\\b${specificIP.replace(/\./g, '\\.')}\\b`); //Linux IP Tables Log file -- /var/log/iptables.log 
    // Define a regular expression to match the datetime in the log file
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}\+\d{2}:\d{2}/;

    //const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/; //for Windows Firewall logfile

    // Calculate the datetime for the specified timeframe
    const timeframe = DateTime.now().minus({ days: numberOfDaysAgo });

    // Create a readable stream and a readline interface
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    // Process each line
    rl.on('line', (line) => {
        const datetimeMatch = line.match(datetimeRegex);
        const ipMatches = line.match(ipRegex);

        // Skip lines that do not contain a datetime or the specific IP address
        if (!datetimeMatch || !ipMatches) {
            return;
        }

        if (datetimeMatch && ipMatches) {
            const datetime = DateTime.fromISO(datetimeMatch[0]);
            if (datetime > timeframe) {
                console.log(`AN INTERACTION WITH BLACKLISTED IP ADDRESS "${specificIP}" IS FOUND HERE!!!: ${line}`);
            }
        }
    });

    rl.on('close', () => {
        console.log('Finished processing the log file.');
    });
}

module.exports = findSpecificIP;
