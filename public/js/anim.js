var imgs = document.getElementsByClassName('gallery-item');
for(i = 0; i < imgs.length; i++) {
    imgs[i].classList.add('animGL');
    imgs[i].style.setProperty('animation-delay', `${(0.1 * i)}s`);
}