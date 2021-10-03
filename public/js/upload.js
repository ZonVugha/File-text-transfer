const uploadFileForm = document.querySelector('#uploadFileForm');
const uploadFileInp = uploadFileForm.querySelector('#uploadFile');
const uploadFileBtn = uploadFileForm.querySelector('#uploadFileBtn');

// uploadFile
uploadFileBtn.addEventListener('click', () => {
    let formData = new FormData();
    const getFile = uploadFileInp.files[0];
    formData.append('uploadFile', getFile);//key is input name value is file data
    fetch('/api/uploadFile', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));

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

const textUlUpload = document.querySelector('#textUl');
uploadTextBtn.addEventListener('click', () => {
    let formData = new FormData();
    formData.append('textKey', uploadText.value);
    fetch('/api/uploadText', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then((result) => {
            uploadText.value = '';
            textUlUpload.insertAdjacentHTML('afterbegin', 
            `
            <li class="list-group-item textBox">
            <div>
                <div id="show" data-bs-toggle="collapse" href="#${result.uuid}" role="button" aria-expanded="false" class="d-flex">
                    <span class="textTitle">${result.textKey}</span>
                    <i class="ms-auto bi bi-chevron-down textItemChevronDown"></i>
                </div>
                <div class="float-end">
                    <span> <i class="bi bi-files"></i>
                        <i class="bi bi-trash"></i></span>
                </div>
            </div>
                <span id="${result.uuid}" class="collapse">${result.textKey}</span>
        </li>
            `);
            console.log(result.Success);
        }).catch((err) => {
            console.log(err);
        });
})
