const express = require('express');
const path = require('path');
const fs = require('fs')
const formidable = require('formidable');


const config = require('./config.json');
const exp = require('constants');
const router = express.Router();

// const filePath = path.join(__dirname, 'sava/');
const form = formidable({ multiples: true, uploadDir: config.uploadFilePath, keepExtensions: true, allowEmptyFiles: false, maxFileSize: 1 * 1024 * 1024 });

router.post('/', (req, res) => {
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log("error is : " + err);
            // res.render('index', {
            //         type: 'danger',
            //         intro: 'Wring',
            //         message: `Error: ${err}!`                  
            // })
            res.status(400).json({ error: `Upload fail The reason for the failed upload failure is ${err}` });
        } else {
            res.redirect('/');
        } 

    });
})
module.exports = router;