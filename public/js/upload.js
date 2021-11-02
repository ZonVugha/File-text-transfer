const uploadFileForm = document.querySelector('#uploadFileForm');
const uploadFileInp = uploadFileForm.querySelector('#uploadFile');
const uploadFileBtn = uploadFileForm.querySelector('#uploadFileBtn');

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
            toastr[data.status](data.message, data.status);
        })
        .catch(err => console.log(err));
}
const progressCard = document.getElementById('progressCard');
const progressUl = progressCard.querySelector('ul');
// uploadFile
uploadFileBtn.addEventListener('click', () => {
    let formData = new FormData();
    const getFile = uploadFileInp.files[0];
    formData.append('uploadFile', getFile);//key is input name value is file data
    //add progress bar
    progressUl.insertAdjacentHTML('afterbegin', `
        <li class="list-group-item" id="liID${getFile.lastModified}">
        <div class="card-body">
            <span class="text-break">${getFile.name}</span>
            <div class="d-flex align-items-center">
                <div class="progress w-100">
                    <div class="progress-bar" id="barID${getFile.lastModified}" role="progressbar" aria-valuenow="0"
                        aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <i class="bi bi-x" id="cancelBtn${getFile.lastModified}"></i>
            </div>
        </div>
        </li>
        `);
    const progressBar = document.getElementById(`barID${getFile.lastModified}`);
    const progressLi = document.getElementById(`liID${getFile.lastModified}`);
    const progressCancelBtn = document.getElementById(`cancelBtn${getFile.lastModified}`);
    const ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", checkProgress, false);
    ajax.addEventListener('load', uploadFinish, false);
    ajax.addEventListener('abort',(e)=> {

    })
    ajax.open('POST', '/api/uploadFile');
    ajax.send(formData);

    progressCancelBtn.addEventListener('click', () => {
        ajax.abort();
        progressLi.remove();
    })
    function checkProgress(e) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progressBar.textContent = percent + '%';
        progressBar.style.width = percent + '%';
        progressBar.ariaValueNow = percent;
    }
    function uploadFinish(e) {
        const data = JSON.parse(e.target.responseText);
        toastr[data.status](data.message, data.status);
        progressLi.remove();
    }
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