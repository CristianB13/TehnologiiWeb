let hueIcon = document.getElementById("hue-icon");
let sunIcon = document.getElementById("sun-icon");
let scaleIcon = document.getElementById("scale-icon");
let opacityIcon = document.getElementById("opacity-icon");

function startRecording(rec, chunks, icon, iconClass) {
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = e => saveVideo(new Blob(chunks, {type: 'video/webm'}), icon, iconClass);
    rec.start();
}

function saveVideo(blob, icon, iconClass) {
    const a = document.createElement('a');
    a.download = 'myVideo.webm';
    a.href = URL.createObjectURL(blob);
    a.textContent = 'download the video';
    a.click()
    icon.classList = iconClass;
}


function hueAnimation() {
    saveImage();
    let canvas = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "html:canvas"
    );
    canvas.height = image.scrollHeight;
    canvas.width = image.scrollWidth;

    let ctx = canvas.getContext("2d");

    let filter = 100;
    const chunks = [];
    const stream = canvas.captureStream();
    const rec = new MediaRecorder(stream);

    hueIcon.classList = "fa-solid fa-spinner fa-spin-pulse";
    let interval = setInterval(() => {
        ctx.save();
        if(filter == 360) {
            clearInterval(interval);
            rec.stop();
        }
        ctx.filter = `hue-rotate(${filter}deg)`;
        filter++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.scrollWidth, image.scrollHeight);
        ctx.restore();
    }, 1000/60);
    startRecording(rec, chunks, hueIcon, "fa-solid fa-palette");
}

function opacityAnimation() {
    saveImage();
    let canvas = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "html:canvas"
    );
    canvas.height = image.scrollHeight;
    canvas.width = image.scrollWidth;

    let ctx = canvas.getContext("2d");

    let opacity = 0;
    const chunks = [];
    const stream = canvas.captureStream();
    const rec = new MediaRecorder(stream);

    opacityIcon.classList = "fa-solid fa-spinner fa-spin-pulse";
    let interval = setInterval(() => {
        ctx.save();
        if(opacity >= 100) {
            clearInterval(interval);
            rec.stop();
        }
        ctx.filter = `opacity(${opacity}%)`;
        opacity += 0.33;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.scrollWidth, image.scrollHeight);
        ctx.restore();
    }, 1000/60);
    startRecording(rec, chunks, opacityIcon, "fa-solid fa-droplet");
}

function scaleAnimation() {
    saveImage();
    let canvas = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "html:canvas"
    );
    canvas.height = image.scrollHeight;
    canvas.width = image.scrollWidth;

    let ctx = canvas.getContext("2d");

    let dwidth = 0;
    let dheight = 0;
    const chunks = [];
    const stream = canvas.captureStream();
    const rec = new MediaRecorder(stream);

    scaleIcon.classList = "fa-solid fa-spinner fa-spin-pulse";
    let interval = setInterval(() => {
        ctx.save();
        if(dwidth >= image.scrollWidth) {
            clearInterval(interval);
            rec.stop();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(image.scrollWidth/2, image.scrollHeight/2);
        ctx.drawImage(image, -dwidth/2, -dheight/2, dwidth, dheight);
        dheight += image.scrollHeight/100;
        dwidth += image.scrollWidth/100;
        ctx.restore();
    }, 1000/60);
    startRecording(rec, chunks, scaleIcon, "fa-solid fa-maximize");
}

function sunAnimation() {
    saveImage();
    let canvas = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "html:canvas"
    );
    canvas.height = image.scrollHeight;
    canvas.width = image.scrollWidth;
    
    let ctx = canvas.getContext("2d");
    
    let deg = 0;
    const chunks = [];
    const stream = canvas.captureStream();
    const rec = new MediaRecorder(stream);

    let mask = new Image();
    mask.src = "../public/images/sun-solid.svg";
    mask.width = image.scrollWidth;
    document.body.appendChild(mask);
    let maskWidth = 0;
    let maskHeight = 0;

    
    mask.addEventListener('load', () => {
        maskWidth = mask.width;
        maskHeight = mask.height;
        document.body.removeChild(mask);
        sunIcon.classList = "fa-solid fa-spinner fa-spin-pulse";
        let interval = setInterval(() => {
            if(deg == 360) {
                clearInterval(interval);
                rec.stop();
            }
            ctx.save();
            console.log(mask.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let width = Math.min(image.scrollWidth / maskWidth, image.scrollHeight / maskHeight);
            ctx.translate(image.scrollWidth/2, image.scrollHeight/2);
            ctx.rotate((Math.PI / 180) * deg);
            ctx.drawImage(mask, -maskWidth*width/2, -maskHeight*width/2, maskWidth * width, maskHeight * width);
            ctx.globalCompositeOperation = "source-in";
            ctx.rotate(-(Math.PI / 180) * deg)
            ctx.translate(-image.scrollWidth/2, -image.scrollHeight/2);
            ctx.drawImage(image, 0, 0, image.scrollWidth, image.scrollHeight);
            deg++;
            ctx.restore();
        }, 1000/60);
        startRecording(rec, chunks, sunIcon, "fa-solid fa-sun");
    });
}
