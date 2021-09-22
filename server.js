const http = require('http');
const path = require('path');
const fs = require('fs')
const formidable = require('formidable');

const port = 8088;//

const server = http.createServer((request, response) => {

    const method = request.method;
    const url = request.url;
    console.log(url);
    if (method === 'POST') {
        if (url === '/pushFile') {
            const form = new formidable.IncomingForm();
            form.parse(request, (err, fields, files) => {
                let oldPath = files.file.path;
                let newPath = path.join(__dirname, 'sava/') + files.file.name;
                fs.readFile(oldPath, function (err, data) {
                    if (err) throw err;

                    console.log('File read!');

                    // Write the file
                    fs.writeFile(newPath, data, function (err) {
                        if (err) throw err;
                        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
                            if (err) {
                                console.log(err);
                            }
                            response.end(data);
                        });
                        console.log('File written!');
                    });

                    // Delete the file
                    fs.unlink(oldPath, function (err) {
                        if (err) throw err;

                        console.log('File deleted!');
                    });
                });
            })
        }
    } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            if (err) {
                console.log(err);
            }
            response.end(data);
        });
    }

});
const PORT = process.env.PORT || port;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
