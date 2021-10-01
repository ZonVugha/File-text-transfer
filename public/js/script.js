const panel = document.querySelectorAll('.panel');
panel.forEach((item) => {
    item.addEventListener('click', function(){
        panel.forEach((element) => {
            element.classList.remove('active');
        })
        item.classList.add('active')
    })
})