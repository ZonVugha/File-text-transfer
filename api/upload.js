const express = require('express');
const path = require('path');
const fs = require('fs')
const multer = require('multer');

const router = express.Router();
const config = require('../config.json');

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
        return res.status(200).send({ Success: 'upload success!' });
    })
});

module.exports = router;