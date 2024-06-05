const os = require('os');

function getOS() {
    let platform = os.platform();
    let osName = '';

    switch (platform) {
        case 'darwin':
            osName = 'macOS';
            break;
        case 'linux':
            osName = 'Linux';
            break;
        case 'win32':
            osName = 'Windows';
            break;
        default:
            osName = 'Unknown';
            break;
    }
    return osName;
}
module.exports = { getOS };


