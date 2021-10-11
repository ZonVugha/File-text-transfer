const urlText = '/index/cacheLog/textLog.json';
const urlFile = '/index/cacheLog/fileLog.json';
const path = '../index/savaFile/'
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
        .then(data => console.log(data));
}
const textUl = document.querySelector('#textUl');
let setTextData = (getData) => {
    getData.forEach((element, index) => {
        textUl.insertAdjacentHTML('afterbegin',
            `
        <li class="list-group-item textBox">
            <div>
                <div id="show" data-bs-toggle="collapse" data-bs-target="#${element.uuid}" role="button" class="d-flex btn-toggle collapsed" aria-expanded="false">
                    <span class="textTitle">${element.textKey}</span>
                </div>
                <div class="float-end">
                    <span> <i id=${index} class="bi bi-files"></i>
                        <i id=${index} class="bi bi-trash"></i></span>
                </div>
            </div>
                <span id="${element.uuid}" class="collapse">${element.textKey}</span>
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
            <li class="list-group-item">${thumbnail(path + element.filename, index, element.mimetype, element.originalname)} ${element.originalname}</br>${bytesToSize(element.size)}<span class="float-end"><i id=${index} class="bi bi-cloud-download"></i>
            <i id=${index} class="bi bi-trash"></i></span></li>
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
function thumbnail(url, index, type, filename) {
    const reader = new FileReader();
    const suffix = filename.lastIndexOf('.');
    const zipFileArr = ['zip', '7z', 'rar','gz','tar','xz'];
    if (type.search('image') != -1) {
        fetch(url)
            .then(res => res.blob([res], { type: type }))
            .then(blob => {
                reader.onload = (e) => {
                    const div = document.createElement('div');
                    const img = document.createElement('img')
                    img.className = 'img-thumbnail'
                    img.src = reader.result;
                    div.className = 'crop-technique1';
                    const liList = fileUl.querySelectorAll('li');
                    const li = liList[liList.length - index - 1]
                    div.appendChild(img)
                    li.prepend(div);
                }
                reader.readAsDataURL(blob);
            })
            .catch(err => console.log(err));
        return '';
    } else if (zipFileArr.includes(filename.substr(suffix + 1))) {
        return '<i class="bi bi-file-earmark-zip"></i>';
    } else if (type.search('audio') != -1) {
        return '<i class="bi bi-file-earmark-music"></i>';
    } else if (type.search('text') != -1) {
        return '<i class="bi bi-file-earmark-text"></i>';
    } else{
        return '<i class="bi bi-file-earmark"></i>';
    }
}
function download(url, filename, type) {
    const reader = new FileReader();
    fetch(url)
        .then(response => response.blob([response], { type: type }))
        .then(blob => {
            reader.onload = (e) => {
                // window.location.href = reader.result;
                const link = document.createElement("a");
                link.href = reader.result;
                link.download = filename;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }

            reader.readAsDataURL(blob);
        })
        .catch(console.error);
}
fileUl.addEventListener('click', async (e) => {
    // click download icon download file
    if (e.target && e.target.className == 'bi bi-cloud-download') {
        let data = await getText(urlFile);
        if (e.target.id) {
            const fileInfo = data.File[e.target.id];
            await download(`${path + fileInfo.filename}`, fileInfo.originalname, fileInfo.mimetype);
        } else {
            await download(`${path + data.File[data.File.length - 1].filename}`, data.File[data.File.length - 1].originalname, data.File[data.File.length - 1].mimetype);
        }
    }

    if (e.target && e.target.className == 'bi bi-trash') {
        const element = getNthParent(e.target, 2);
        if (e.target.id) {
            await deleteData(`/api/deleteFile/${e.target.id}`);
        } else {
            const lastOne = e.currentTarget.querySelectorAll('li').length - 1;
            await deleteData(`/api/deleteFile/${lastOne}`);
        }
        element.remove();
    }
})

textUl.addEventListener('click', async (e) => {
    // click copy icon copy text
    if (e.target && e.target.className == 'bi bi-files') {
        let data = await getText(urlText);
        if (e.target.id) {
            const dataFromIndex = data.text[e.target.id].textKey;
            navigator.clipboard.writeText(dataFromIndex);
        } else {
            navigator.clipboard.writeText(data.text[data.text.length - 1].textKey);
        }
    }
    // click text delete icon delete element and text data
    if (e.target && e.target.className == 'bi bi-trash') {
        const element = getNthParent(e.target, 4);
        if (e.target.id) {
            await deleteData(`/api/deleteText/${e.target.id}`);
        } else {
            const lastOne = e.currentTarget.querySelectorAll('li').length - 1;
            await deleteData(`/api/deleteText/${lastOne}`);
        }
        element.remove();
    }
})
