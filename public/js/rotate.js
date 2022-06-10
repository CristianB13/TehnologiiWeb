let angle = 90;
let rotateValue = 0;    
function setRotation(direction) {
    if(currentFlipX == currentFlipY) {
        direction === 'right' ? rotateValue = angle + rotateValue : rotateValue = -angle + rotateValue;
    } else {
        direction === 'right' ? rotateValue = -angle + rotateValue : rotateValue = angle + rotateValue;
    }
    currentTransform = image.style.getPropertyValue('transform');
    let reg = new RegExp(`rotate[\\s ]*\\([^\\)]+\\)`);
    image.style.transform = currentTransform.replace(reg, `rotate(${rotateValue}deg)`);
}

let flipX = 180;
let currentFlipX = 0;
let flipY = 180;
let currentFlipY = 0;

function setFlipX() {
    [flipX, currentFlipX] = [currentFlipX, flipX];
    currentTransform = image.style.getPropertyValue('transform');
    let reg = new RegExp(`rotateX[\\s ]*\\([^\\)]+\\)`);
    image.style.transform = currentTransform.replace(reg, `rotateX(${currentFlipX}deg)`);
}

function setFlipY() {
    [flipY, currentFlipY] = [currentFlipY, flipY];
    currentTransform = image.style.getPropertyValue('transform');
    let reg = new RegExp(`rotateY[\\s ]*\\([^\\)]+\\)`);
    image.style.transform = currentTransform.replace(reg, `rotateY(${currentFlipY}deg)`);
}