const fs = require('fs');
const path = require('path');

function deleteDir (path) {
    if (fs.existsSync(path)) {
        const files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            const curPath = `${path}/${file}`;
            if (fs.existsSync(curPath) && fs.statSync(curPath).isDirectory()) {
                deleteDir(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        })
        fs.rmdirSync(path);
    }
}

// 删除example目录
const examplePath = path.resolve(__dirname, '../example');
deleteDir(examplePath);

