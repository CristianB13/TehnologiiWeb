function getEdit() {
    let form = document.createElement('form');
    form.method = 'GET';
    form.action = './edit'
    let input = document.createElement('input');
    input.value = document.getElementById('photo-source').src;
    input.name = 'photoSource';
    form.appendChild(input)
    document.body.appendChild(form);
    form.submit();
}