let imageAnim = document.getElementById('edit-img');

function startRecording(rec, chunks) {
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = e => saveVideo(new Blob(chunks, {type: 'video/webm'}));
    rec.start();
}

function saveVideo(blob) {
    const a = document.createElement('a');
    a.download = 'myVideo.webm';
    a.href = URL.createObjectURL(blob);
    a.textContent = 'download the video';
    a.click()
}


function hueAnimation() {
    let canvas = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "html:canvas"
    );
    canvas.height = imageAnim.scrollHeight;
    canvas.width = imageAnim.scrollWidth;

    let ctx = canvas.getContext("2d");

    let filter = 100;
    const chunks = [];
    const stream = canvas.captureStream();
    const rec = new MediaRecorder(stream);

    let interval = setInterval(() => {
        ctx.save();
        if(filter == 360) {
            clearInterval(interval);
            rec.stop();
        }
        ctx.filter = `hue-rotate(${filter}deg)`;
        filter++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageAnim, 0, 0, imageAnim.scrollWidth, imageAnim.scrollHeight);
        ctx.restore();
    }, 1000/60);
    startRecording(rec, chunks);
}

function opacityAnimation() {
    let canvas = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "html:canvas"
    );
    canvas.height = imageAnim.scrollHeight;
    canvas.width = imageAnim.scrollWidth;

    let ctx = canvas.getContext("2d");

    let opacity = 0;
    const chunks = [];
    const stream = canvas.captureStream();
    const rec = new MediaRecorder(stream);

    let interval = setInterval(() => {
        ctx.save();
        if(opacity >= 100) {
            clearInterval(interval);
            rec.stop();
        }
        ctx.filter = `opacity(${opacity}%)`;
        opacity += 0.33;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageAnim, 0, 0, imageAnim.scrollWidth, imageAnim.scrollHeight);
        ctx.restore();
    }, 1000/60);
    startRecording(rec, chunks);
}

function scaleAnimation() {
    let canvas = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "html:canvas"
    );
    canvas.height = imageAnim.scrollHeight;
    canvas.width = imageAnim.scrollWidth;

    let ctx = canvas.getContext("2d");

    let dwidth = 0;
    let dheight = 0;
    const chunks = [];
    const stream = canvas.captureStream();
    const rec = new MediaRecorder(stream);

    let interval = setInterval(() => {
        ctx.save();
        if(dwidth >= imageAnim.scrollWidth) {
            clearInterval(interval);
            rec.stop();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(imageAnim.scrollWidth/2, imageAnim.scrollHeight/2);
        ctx.drawImage(imageAnim, -dwidth/2, -dheight/2, dwidth, dheight);
        dheight += imageAnim.scrollHeight/100;
        dwidth += imageAnim.scrollWidth/100;
        ctx.restore();
    }, 1000/60);
    startRecording(rec, chunks);
}

function sunAnimation() {
    let canvas = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "html:canvas"
    );
    canvas.height = imageAnim.scrollHeight;
    canvas.width = imageAnim.scrollWidth;
    
    let ctx = canvas.getContext("2d");
    
    let deg = 0;
    const chunks = [];
    const stream = canvas.captureStream();
    const rec = new MediaRecorder(stream);

    let mask = new Image();
    mask.src = "../public/images/sun-solid.svg";
    mask.width = imageAnim.scrollWidth;
    document.body.appendChild(mask);
    let maskWidth = 0;
    let maskHeight = 0;

    mask.addEventListener('load', () => {
        maskWidth = mask.width;
        maskHeight = mask.height;
        document.body.removeChild(mask);
        let interval = setInterval(() => {
            if(deg == 360) {
                clearInterval(interval);
                rec.stop();
            }
            ctx.save();
            console.log(mask.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let width = Math.min(imageAnim.scrollWidth / maskWidth, imageAnim.scrollHeight / maskHeight);
            ctx.translate(imageAnim.scrollWidth/2, imageAnim.scrollHeight/2);
            ctx.rotate((Math.PI / 180) * deg);
            ctx.drawImage(mask, -maskWidth*width/2, -maskHeight*width/2, maskWidth * width, maskHeight * width);
            ctx.globalCompositeOperation = "source-in";
            ctx.rotate(-(Math.PI / 180) * deg)
            ctx.translate(-imageAnim.scrollWidth/2, -imageAnim.scrollHeight/2);
            ctx.drawImage(imageAnim, 0, 0, imageAnim.scrollWidth, imageAnim.scrollHeight);
            deg++;
            ctx.restore();
        }, 1000/60);
        startRecording(rec, chunks);
    });
}

// hueAnimation();
// opacityAnimation();
// scaleAnimation();
sunAnimation();

