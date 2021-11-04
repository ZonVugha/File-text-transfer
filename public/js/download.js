const urlText = '/cacheLog/textLog.json';
const urlFile = '/cacheLog/fileLog.json';
const path = '../cache/savaFile/';
const pathThumbnail = '../cache/imgThumbnail/';
const socket = io();

let getText = (url) => {
    return fetch(url)
        .then(res => res.json())
        .then(data => data);
}
let deleteData = (url) => {
    fetch(url, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.log(err));
}
const textUl = document.querySelector('#textUl');
let setTextData = (getData) => {
    getData.forEach((element, index) => {
        textUl.insertAdjacentHTML('afterbegin',
            `
        <li id="id${index}" class="list-group-item textBox">
            <div>
                <div id="show" data-bs-toggle="collapse" data-bs-target="#${element.uuid}" role="button" class="d-flex btn-toggle collapsed" aria-expanded="false">
                    <span class="textTitle">${element.textKey}</span>
                </div>
                <div class="float-end">
                    <span> <i id=${index} class="bi bi-files"></i>
                        <i id=${index} class="bi bi-trash"></i></span>
                </div>
            </div>
                <span id="${element.uuid}" class="collapse showTextWrap">${element.textKey}</span>
        </li>
        `)
    });
}
// Calculate file size
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
const fileUl = document.querySelector('#fileUl');
let setFileData = (getData) => {
    getData.forEach((element, index) => {
        fileUl.insertAdjacentHTML('afterbegin',
            `
        <li id="F${element.filename}" class="list-group-item">${thumbnail(element.originalname, element.mimetype)} ${element.originalname}</br>${bytesToSize(element.size)}
        <span class="float-end"><i id=${index} class="bi bi-cloud-download"></i>
        <i id=${index} class="bi bi-trash"></i></span>
        </li>
        `)
    })
}
function getNthParent(elem, n) {
    return n === 0 ? elem : getNthParent(elem.parentNode, n - 1);
}
async function setText() {
    let data = await getText(urlText);
    await setTextData(data.text);
}
async function setFile() {
    let data = await getText(urlFile);
    await setFileData(data.File);
}
setText();
setFile();
socket.on('resultText', (data) => {
    const liList = textUl.querySelectorAll('li');
    textUl.insertAdjacentHTML('afterbegin',
        `
        <li id="id${liList.length}" class="list-group-item textBox">
        <div>
            <div id="show" data-bs-toggle="collapse" data-bs-target="#${data.uuid}" role="button" class="d-flex btn-toggle collapsed" aria-expanded="false">
                <span class="textTitle">${data.textKey}</span>
            </div>
            <div class="float-end">
                <span> <i id="${liList.length}" class="bi bi-files"></i>
                    <i id="${liList.length}" class="bi bi-trash"></i></span>
            </div>
        </div>
            <span id="${data.uuid}" class="collapse showTextWrap">${data.textKey}</span>
        </li>`);
});
socket.on('resultFile', (data) => {
    const liList = fileUl.querySelectorAll('li');
    fileUl.insertAdjacentHTML('afterbegin',
        `
        <li id="F${data.filename}" class="list-group-item">${thumbnail(data.originalname, data.mimetype)} ${data.originalname}</br>${bytesToSize(data.fileSize)}<span class="float-end"><i id="${liList.length}" class="bi bi-cloud-download"></i> 
        <i id="${liList.length}" class="bi bi-trash"></i></span></li>
        `)
});

function thumbnail(filename, type) {
    const suffix = filename.lastIndexOf('.');
    const zipFileArr = ['zip', '7z', 'rar', 'gz', 'tar', 'xz'];
    if (type.search('image') != -1) {
        return `<div class="crop-technique1"><img class="img-thumbnail" src="${pathThumbnail}${filename}" alt="img"></div>`;
    } else if (zipFileArr.includes(filename.substring(suffix + 1))) {
        return '<i class="bi bi-file-earmark-zip"></i>';
    } else if (type.search('audio') != -1) {
        return '<i class="bi bi-file-earmark-music"></i>';
    } else if (type.search('text') != -1) {
        return '<i class="bi bi-file-earmark-text"></i>';
    } else {
        return '<i class="bi bi-file-earmark"></i>';
    }
}
function download(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
}
fileUl.addEventListener('click', async (e) => {
    // click download icon download file
    if (e.target && e.target.className == 'bi bi-cloud-download') {
        let data = await getText(urlFile);
        const fileInfo = data.File[e.target.id];
        await download(`${path + fileInfo.filename}`, fileInfo.originalname);
    }

    if (e.target && e.target.className == 'bi bi-trash') {
        const deleteID = getNthParent(e.target, 2);
        await deleteData(`/api/deleteFile/${deleteID.id}`);
    }
})

textUl.addEventListener('click', async (e) => {
    // click copy icon copy text
    if (e.target && e.target.className == 'bi bi-files') {
        const getTextOnSpan = getNthParent(e.target, 4).querySelector('span');
        copyTextToClipboard(getTextOnSpan.innerHTML);
    }
    // click text delete icon delete element and text data
    if (e.target && e.target.className == 'bi bi-trash') {
        const deleteUUID = getNthParent(e.target, 4);
        await deleteData(`/api/deleteText/${deleteUUID.lastElementChild.id}`);
    }
})
socket.on('deleteText', (data) => {
    const deleteElement = textUl.querySelector(`#${data}`).parentNode;
    deleteElement.remove();
});
socket.on('deleteFile', (data) => {
    const deleteElement = fileUl.querySelector(`#${data}`);
    deleteElement.remove();
});
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Hidden element
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        successful ? toastr['success']('Copy successfully') : toastr['error']('Copy unsuccessful');
    } catch (err) {
        toastr['error']('Unable to copy');
        console.error('Fallback error: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    // only HTTPS
    navigator.clipboard.writeText(text).then(function () {
        toastr['success']('Copy successfully');
    }, function (err) {
        toastr['error']('Unable to copy');
        console.error('Async error: Could not copy text', err);
    });
}