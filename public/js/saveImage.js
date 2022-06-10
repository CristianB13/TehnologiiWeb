function saveImage(){
    let canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'html:canvas');
    let context = canvas.getContext('2d');
    
    canvas.height = image.scrollHeight;
    canvas.width = image.scrollWidth;

    if(rotateValue % 180) {
        [canvas.width, canvas.height] = [canvas.height, canvas.width];
    }

    context.filter = image.style.filter;
    
    if(currentFlipX == 180){
        //vertical flip
        context.translate(0, canvas.height);
        context.scale(1, -1);
        currentFlipX = 0;
        flipX = 180;
    }

    if(currentFlipY == 180){
        // horizontal flip
        context.translate(canvas.width, 0);
        context.scale(-1,1);
        currentFlipY = 0;
        flipY = 180;
    }

    context.translate(canvas.width/2, canvas.height/2);
    context.rotate((Math.PI/180) * rotateValue);

    context.translate(-image.scrollWidth/2, -image.scrollHeight/2);
    context.drawImage(image, 0, 0, image.scrollWidth, image.scrollHeight);
    rotateValue = 0;
    
    image.src = canvas.toDataURL('image/png', '');
    document.getElementById('contrast').value = 100;
    document.getElementById('contrast').nextElementSibling.value = 100;
    document.getElementById('blur').value = 0;
    document.getElementById('blur').nextElementSibling.value = 0;
    document.getElementById('brightness').value = 100;
    document.getElementById('brightness').nextElementSibling.value = 100;
    document.getElementById('saturation').value = 100;
    document.getElementById('saturation').nextElementSibling.value = 100;
    document.getElementById('grayscale').value = 0;
    document.getElementById('grayscale').nextElementSibling.value = 0;
    document.getElementById('sepia').value = 0;
    document.getElementById('sepia').nextElementSibling.value = 0;
    document.getElementById('invert').value = 0;
    document.getElementById('invert').nextElementSibling.value = 0;
    image.style.filter = '';

    image.style.transitionDuration = '0s';
    image.style.transform = 'rotateX(0deg) rotateY(0deg) rotate(0deg)';
    setTimeout(() => {
        image.style.transitionDuration = '0.3s';
    }, 0);
} 