const urlText = '/cacheLog/textLog.json';
const urlFile = '/cacheLog/fileLog.json';
let getText = (url) => {
    return fetch(url)
        .then(res => res.json())
        .then(data => data);
}
const textUl = document.querySelector('#textUl');
let setTextData = (getData) => {
    getData.forEach(element => {
        textUl.insertAdjacentHTML('afterbegin',
            `
        <li class="list-group-item textBox">
            <div>
                <div id="show" data-bs-toggle="collapse" data-bs-target="#${element.uuid}" role="button" class="d-flex btn-toggle collapsed" aria-expanded="false">
                    <span class="textTitle">${element.textKey}</span>
                </div>
                <div class="float-end">
                    <span> <i class="bi bi-files"></i>
                        <i class="bi bi-trash"></i></span>
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
            <li class="list-group-item">${element.originalname}</br>${bytesToSize(element.size)}<span class="float-end"><i id=${index} class="bi bi-cloud-download"></i> 
            <i class="bi bi-trash"></i></span></li>
            `)
    })
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

function download(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        })
        .catch(console.error);
}
// click download icon download file
fileUl.addEventListener('click', async (e) => {
    if (e.target && e.target.className == 'bi bi-cloud-download') {
        let data = await getText(urlFile);
        const fileInfo = data.File[e.target.id];
        await download(`../savaFile/${fileInfo.filename}`, fileInfo.originalname);
    }
})
