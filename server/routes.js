const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const uuid = require('uuid');
const router = express.Router();

const config = require('../config.json');
const textLogPath = 'public/cacheLog/textLog.json';
const fileLogPath = 'public/cacheLog/fileLog.json';
const fileLogThumbnail = 'public/cacheLog/fileLogThumbnail.json'
const filePath = path.join(__dirname, '..', 'public/', 'savaFile');//sava file path

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, filePath);
    },
});
const uploadMulter = multer({ storage: storage, limits: { fileSize: Number(config.fileMaxSize) } });
let type = uploadMulter.single('uploadFile');
router.post('/uploadFile', type, (req, res) => {
    sharp(req.file.path).resize(200, 200).toFile(path.join(__dirname, '..', 'public/', 'savaFile/', 'imgThumbnail/') + req.file.originalname, (err, resizeImage) => {
        let io = req.app.get('socketio');
        io.sockets.emit('resultFile', ({ originalname: `${req.file.originalname}`, fileSize: `${req.file.size}`, filename: `${req.file.filename}`, mimetype: `${req.file.mimetype}` }));
        if (err) {
            console.log(err);
        }
    })
    fs.readFile(fileLogPath, 'utf-8', (err, data) => {
        const obj = JSON.parse(data);
        obj.File.push(req.file);
        const str = JSON.stringify(obj);
        fs.writeFile(fileLogPath, str, (err) => {
            if (err) {
                console.log(err);
            }
        })
    })
    type(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).send({ Error: `multer error ${err}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).send({ Error: `error ${err}` });
        }
        return res.status(200).send({ status: 'success', message: 'upload file success!' });
    })
});
const typeText = uploadMulter.none();
router.post('/uploadText', typeText, (req, res) => {
    let io = req.app.get('socketio');

    let textAdd = {
        'textKey': req.body.textKey,
        'uuid': "t" + uuid.v1()
    }
    io.sockets.emit('resultText', ({ textKey: `${textAdd.textKey}`, uuid: `${textAdd.uuid}` }));
    fs.readFile(textLogPath, 'utf-8', (err, data) => {
        const obj = JSON.parse(data)
        obj.text.push(textAdd);
        const str = JSON.stringify(obj);
        fs.writeFile(textLogPath, str, (err) => {
            if (err) {
                console.log(err);
            }
        })
    })
    typeText(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).send({ Error: `multer error ${err}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).send({ Error: `error ${err}` });
        }
        return res.status(200).send({ status: 'success', message: 'upload text success!' });
    })

})
router.delete('/deleteText/:id', (req, res) => {
    let io = req.app.get('socketio');

    io.sockets.emit('deleteText', (req.params.id));
    fs.readFile(textLogPath, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        }
        const obj = JSON.parse(data)
        const deleteIndex = req.params.id;
        obj.text.forEach((element, index) => {
            if (element.uuid === deleteIndex) {
                obj.text.splice(index, 1);
            }
        });
        const str = JSON.stringify(obj);
        fs.writeFile(textLogPath, str, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send({ Success: `delete text success` });
            }
        })
    })
})
router.delete('/deleteFile/:id', (req, res) => {
    let io = req.app.get('socketio');

    io.sockets.emit('deleteFile', (req.params.id));
    fs.readFile(fileLogPath, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        }
        const obj = JSON.parse(data)
        let deleteIndex = req.params.id;
        deleteIndex = deleteIndex.slice(1, deleteIndex.length);
        obj.File.forEach((element, index) => {
            if (element.filename === deleteIndex) {
                fs.unlink(obj.File[index].path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                obj.File.splice(index, 1);
            }
        });
        const str = JSON.stringify(obj);
        fs.writeFile(fileLogPath, str, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send({ Success: `delete file success` });
            }
        })
    })
})

module.exports = router;