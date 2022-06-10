let image = document.getElementsByClassName('edit')[0].getElementsByTagName('img')[0];

function setFilter(filter, value, unit) {
    currentFilter = image.style.getPropertyValue('filter');
    let reg = new RegExp(`${filter}[\\s ]*\\([^\\)]+\\)`);
    currentFilter = currentFilter.replace(reg, '');
    image.style.filter = currentFilter + `${filter}(${value}${unit})`;
}