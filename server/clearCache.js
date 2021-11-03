const fs = require('fs');
const path = require('path');
const imgThumbnailPath = path.join(__dirname, '..', 'public/', 'cache/', 'imgThumbnail/');//sava thumbnail path
const fileLogPath = 'public/cacheLog/fileLog.json';

function clearCache() {
    console.log('clear');
    cache(imgThumbnailPath, 'originalname');//clear thumbnail
}
function cache(path, name) {
    let deleteFileArr = [];
    fs.readdir(path, (err, files) => {
        if (err) {
            console.log(err);
        }
        files.forEach(file => {
            deleteFileArr.push(file);
        })
        fs.readFile(fileLogPath, 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            }
            const obj = JSON.parse(data);
            obj.File.forEach((item) => {
                const itemName = (name == 'filename') ? item.filename : item.originalname;
                deleteFileArr.forEach((value, index) => {
                    if (itemName === value) {
                        deleteFileArr.splice(index, 1);
                    }
                })
            })
            deleteFileArr.forEach(filename => {
                fs.unlink(path + filename, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(filename+" was delete");
                    }
                })
            })
            deleteFileArr = [];
        })
    })
}
module.exports = clearCache;
