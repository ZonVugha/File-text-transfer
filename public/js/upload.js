const uploadFileForm = document.querySelector('#uploadFileForm');
const uploadFileInp = uploadFileForm.querySelector('#uploadFile');
const uploadFileBtn = uploadFileForm.querySelector('#uploadFileBtn');
const socket = io();

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

const postData = (url, data) => {
    fetch(url, {
        method: 'POST',
        body: data
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            toastr[data.status](data.message, data.status);
        })
        .catch(err => console.log(err));
}
// uploadFile
uploadFileBtn.addEventListener('click', () => {
    let formData = new FormData();
    const getFile = uploadFileInp.files[0];
    formData.append('uploadFile', getFile);//key is input name value is file data
    postData('/api/uploadFile', formData);
    if (uploadFileInp.value) {
        try {
            uploadFileInp.value = ''; //for IE11, latest Chrome
        } catch (err) {
            console.log(err);
        }
        if (uploadFileInp.value) { //for IE5 ~ IE10
            uploadFileForm.reset();

        }
    }
})
socket.on('resultFile', (data) => {
    const liList = fileUl.querySelectorAll('li');
    fileUl.insertAdjacentHTML('afterbegin',
        `
    <li class="list-group-item">${thumbnail(path + data.filename, liList.length, data.mimetype, data.originalname)} ${data.originalname}</br>${bytesToSize(data.fileSize)}<span class="float-end"><i class="bi bi-cloud-download"></i> 
    <i class="bi bi-trash"></i></span></li>
    `)
})
// upload text
const uploadTextForm = document.querySelector('#uploadTextForm');
const uploadText = uploadTextForm.querySelector('#uploadText');
const uploadTextBtn = uploadTextForm.querySelector('#uploadTextBtn');

uploadTextBtn.addEventListener('click', () => {
    let formData = new FormData();
    formData.append('textKey', uploadText.value);
    postData('/api/uploadText', formData);
    uploadText.value = '';
    uploadTextBtn.disabled = true;
})
socket.on('resultText', (data) => {
    textUl.insertAdjacentHTML('afterbegin',
        `
    <li class="list-group-item textBox">
    <div>
        <div id="show" data-bs-toggle="collapse" data-bs-target="#${data.uuid}" role="button" class="d-flex btn-toggle collapsed" aria-expanded="false">
            <span class="textTitle">${data.textKey}</span>
        </div>
        <div class="float-end">
            <span> <i class="bi bi-files"></i>
                <i class="bi bi-trash"></i></span>
        </div>
    </div>
        <span id="${data.uuid}" class="collapse showTextWrap">${data.textKey}</span>
</li>
    `);
})
