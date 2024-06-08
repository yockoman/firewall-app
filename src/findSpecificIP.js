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
        console.error('Usage: findSpecificIP(<path-to-log-file>, <specific-ip-address>)');
        return;
    }

    // Define a regular expression to match IPv4 addresses, including the specific IP address
    const ipRegex = new RegExp(`\\b${specificIP.replace(/\./g, '\\.')}\\b`);
    // Define a regular expression to match the datetime in the log file
    const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;

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

         // Skip lines that do not contain a datetime or an IP address
         if (!datetimeMatch || !ipMatches) {
            return;
        }

        if (datetimeMatch && ipMatches) {
            const datetime = DateTime.fromFormat(datetimeMatch[0], 'yyyy-MM-dd HH:mm:ss');
            if (datetime > timeframe) {
                console.log('AN INTERACTION WITH BLACKLISTED IP ADRESS "'+ specificIP + '" IS FOUND HERE!!!:' + line);
            }
        }
    });
}

module.exports = findSpecificIP;
