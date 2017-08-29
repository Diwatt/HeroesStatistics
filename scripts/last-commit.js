const fetch = require('isomorphic-fetch');
const path = require('path');
const fs = require('fs');

const destDir = [__dirname, '..', 'bin'].join(path.sep);
const filename = 2 in process.argv ? process.argv[2] : 'last-commit.version';
const dest =  [destDir, filename].join(path.sep);
const url = 'https://api.github.com/repos/Blizzard/heroprotocol/git/refs/heads/master';
fetch(url).then((response) => {
   return response.json();
}).then((data) => {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    }

    if (fs.existsSync(dest)) {
        fs.unlinkSync(dest)
    }

    fs.writeFileSync(dest, data.object.sha);
});
