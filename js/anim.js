var images = document.getElementsByClassName('gallery-item');
console.log(images.length)
for(i = 0; i < images.length; i++) {
    images[i].classList.add('animGL');
    images[i].style.setProperty('animation-delay', `${(0.1 * i)}s`)
}