Installation:
git clone https://github.com/yockoman/firewall-app.git
cd firewall-app
npm install

Usage:
if you want to use the local endpoint that returns some IP addresses imitating the API Call to the ABUSE IP first you need to run "node .\server.js" and change the code to run on localhost:3000 in the fetchBlacklistedIPs.js file
![alt text](image.png)
node index.js

// optional
node index.js "directory to communication history file" -- for example node index.js test.txt
node index.js "directory to communication history file" "number of days in the past to search for in the history file" -- for example node index.js test.txt 6