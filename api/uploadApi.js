const express = require('express');
const path = require('path');
const fs = require('fs')
const multer = require('multer');
const uuid = require('uuid');

const router = express.Router();
const config = require('../config.json');
// const textLog = require('../sava/cacheLog/textLog.json');
// const textLogArr = require('../sava/cacheLog/textLog');
// const filePath = path.join(__dirname, 'sava/');
const maxSize = 1 * 1024 * 1024
const uploadMulter = multer({ dest: config.uploadFilePath, limits: { fileSize: Number(config.fileMaxSize) } });
let type = uploadMulter.single('uploadFile');
router.post('/uploadFile', type, (req, res) => {
    console.log(req);

    type(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).send({ Error: `multer error ${err}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).send({ Error: `error ${err}` });
        }
        return res.status(200).send({ Success: 'upload file success!' });
    })
});
const typeText = uploadMulter.none();

router.post('/uploadText', typeText, (req, res) => {
    console.log(req.body.textKey);
    let textAdd = {
        'textKey': req.body.textKey,
        'uuid': "a"+uuid.v1()
    }
    res.status(200).send({Success:'upload text success!',textKey:`${textAdd.textKey}`,uuid:`${textAdd.uuid}`});
    const cachePath = 'public/cacheLog/textLog.json';
    fs.readFile(cachePath, 'utf-8', (err, data) => {
        const obj = JSON.parse(data)
        obj.text.push(textAdd);
        const str = JSON.stringify(obj);
        fs.writeFile(cachePath, str, (err) => {
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
        console.log("tyres");
        // return res.status(200).send({ Success: 'upload text success!' });
    })

})

module.exports = router;