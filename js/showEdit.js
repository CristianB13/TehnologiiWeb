const filters = document.getElementById('filters');
const masks = document.getElementById('masks');
const tags = document.getElementById('tags');
const rotations = document.getElementById('rotations');

function showFilters() {
    let current = document.getElementsByClassName('active')[0];
    current.classList.add('hidden');
    current.classList.remove('active');
    filters.classList.add('active');
    filters.classList.remove('hidden');
}

function showMasks() {
    let current = document.getElementsByClassName('active')[0];
    current.classList.add('hidden');
    current.classList.remove('active');
    masks.classList.add('active');
    masks.classList.remove('hidden');
}

function showTags() {
    let current = document.getElementsByClassName('active')[0];
    current.classList.add('hidden');
    current.classList.remove('active');
    tags.classList.add('active');
    tags.classList.remove('hidden');
}

function showRotations() {
    let current = document.getElementsByClassName('active')[0];
    current.classList.add('hidden');
    current.classList.remove('active');
    rotations.classList.add('active');
    rotations.classList.remove('hidden');
}