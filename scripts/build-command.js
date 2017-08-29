const path = require('path');
const fs = require('fs');

const dir = [__dirname, '..', 'heroprotocol'].join(path.sep);
const filename = [__dirname, 'build.sh'].join(path.sep);
let cmd = "#!/bin/sh\ncd ./heroprotocol && pyinstaller heroprotocol.py --distpath ./../bin --onefile --clean";
fs.readdirSync(dir).forEach(file => {
    if (/^protocol/.test(file)) {
        cmd += " --hidden-import " +file.replace('.py', '');
    }
});

if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
}
fs.writeFileSync(filename, cmd);
