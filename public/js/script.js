const panel = document.querySelectorAll('.panel');
const title = document.querySelectorAll('.title');

title.forEach((item) => {
    item.addEventListener('click', () => {
        panel.forEach((element) => {
            element.classList.toggle('active');
            element.scrollTop = 0;
            const iconElementAll = element.querySelector('.iconElement');
            iconElementAll.classList.toggle('touch');
        })
    })
})

uploadText.addEventListener('input', () => {
    if (Boolean(uploadText.value)) {
        uploadTextBtn.disabled = false;
    } else {
        uploadTextBtn.disabled = true;
    }
})