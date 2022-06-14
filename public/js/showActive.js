const gallery = document.getElementsByClassName('gallery')[0];
const connections = document.getElementsByClassName('connections')[0];
const settings = document.getElementsByClassName('settings')[0];
const bar = document.getElementsByClassName('bar')[0];

function showGallery(){
    let current = document.getElementsByClassName('active')[0]
    current.classList.add('hidden');
    current.classList.remove('active');
    gallery.classList.add('active');
    gallery.classList.remove('hidden');
    bar.classList.add('hide-bar');
}

function showConnections() {
    let current = document.getElementsByClassName('active')[0];
    current.classList.add('hidden');
    current.classList.remove('active');
    connections.classList.add('active');
    connections.classList.remove('hidden');
    bar.classList.add('hide-bar');
}

function showSettings() {
    let current = document.getElementsByClassName('active')[0];
    current.classList.add('hidden');
    current.classList.remove('active');
    settings.classList.add('active');
    settings.classList.remove('hidden');
    bar.classList.add('hide-bar');
}

function showBar(){
    bar.classList.toggle("hide-bar");
}
