const url = '/cacheLog/textLog.json';
let getText = () => {
    return fetch(url)
        .then(res => res.json())
        .then(data => data);
}
const textUl = document.querySelector('#textUl');
let setData = (getData) => {
    getData.forEach(element => {
        textUl.insertAdjacentHTML('afterbegin',
            `
        <li class="list-group-item textBox">
        <div>
            <div id="show" data-bs-toggle="collapse" href="#${element.uuid}" role="button" aria-expanded="false" class="d-flex">
                <span class="textTitle">${element.textKey}</span>
                <i class="ms-auto bi bi-chevron-down textItemChevronDown"></i>
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
async function setText() {
    let data = await getText();
    await setData(data.text);
    await turnTextIcon();
}
setText();
