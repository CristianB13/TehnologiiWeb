function getEdit() {
    let form = document.createElement('form');
    form.method = 'GET';
    form.action = './edit'
    let inputPhotoSource = document.createElement('input');
    inputPhotoSource.value = document.getElementById('photo-source').src;
    inputPhotoSource.name = 'photoSource';
    form.appendChild(inputPhotoSource)
    form.style.display = "none";
    document.body.appendChild(form);
    form.submit();
}