const fs = require('fs');

export default function deleteFile (path) {
    if (fs.existsSync(path)) {
        if (fs.statSync(path).isDirectory()) {
            // 删除文件夹
            const files = fs.readdirSync(path);
            files.forEach(function(file, index) {
                const curPath = `${path}/${file}`;
                deleteFile(curPath);
            })
            fs.rmdirSync(path);
        } else {
            // 删除文件
            fs.unlinkSync(path);
        }
    }
}