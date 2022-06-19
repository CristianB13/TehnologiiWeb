let editSaveButton = document.getElementById("edit-save");
let editDownloadButton = document.getElementById("edit-download");
let editUpdateButton = document.getElementById("edit-update");
let coordinates = [];
let clip = false;
let mousedown = false;
let restore = [];
let mpicPopUp = document.getElementById("mpic-pop-up");
let inputMpic = document.getElementById("mpic-input");

inputMpic.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        postImage();
    }
});

if (image.hasAttribute("data-mpic-id")) {
    editUpdateButton.classList.remove("hidden");
}

function saveImage() {
    return new Promise((resolve, reject) => {
        restore.push(image.src);
        let myMask = document.createElement("img");
        if (localStorage.getItem("maskUrl") != "") {
            myMask.src = localStorage.getItem("maskUrl");
        }
        setMask("", "", undefined);
        let canvas = document.createElementNS(
            "http://www.w3.org/1999/xhtml",
            "html:canvas"
        );
        let context = canvas.getContext("2d");
    
        canvas.height = image.scrollHeight;
        canvas.width = image.scrollWidth;
    
        if (rotateValue % 180) {
            [canvas.width, canvas.height] = [canvas.height, canvas.width];
        }
    
        context.filter = image.style.filter;
    
        if (currentFlipX == 180) {
            //vertical flip
            context.translate(0, canvas.height);
            context.scale(1, -1);
            currentFlipX = 0;
            flipX = 180;
        }
    
        if (currentFlipY == 180) {
            // horizontal flip
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            currentFlipY = 0;
            flipY = 180;
        }
    
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate((Math.PI / 180) * rotateValue);
    
        context.translate(-image.scrollWidth / 2, -image.scrollHeight / 2);
        rotateValue = 0;
        document.getElementById("contrast").value = 100;
        document.getElementById("contrast").nextElementSibling.value = 100;
        document.getElementById("blur").value = 0;
        document.getElementById("blur").nextElementSibling.value = 0;
        document.getElementById("brightness").value = 100;
        document.getElementById("brightness").nextElementSibling.value = 100;
        document.getElementById("saturation").value = 100;
        document.getElementById("saturation").nextElementSibling.value = 100;
        document.getElementById("grayscale").value = 0;
        document.getElementById("grayscale").nextElementSibling.value = 0;
        document.getElementById("sepia").value = 0;
        document.getElementById("sepia").nextElementSibling.value = 0;
        document.getElementById("invert").value = 0;
        document.getElementById("invert").nextElementSibling.value = 0;
        image.style.filter = "";
    
        image.style.transitionDuration = "0s";
        image.style.transform = "rotateX(0deg) rotateY(0deg) rotate(0deg)";
        setTimeout(() => {
            image.style.transitionDuration = "0.3s";
        }, 0);
        if (myMask.src != "") {
            myMask.onload = () => {
                let width = Math.min(
                    image.scrollWidth / myMask.width,
                    image.scrollHeight / myMask.height
                );
                context.drawImage(
                    myMask,
                    (image.scrollWidth - myMask.width * width) / 2,
                    (image.scrollHeight - myMask.height * width) / 2,
                    myMask.width * width,
                    myMask.height * width
                );
                context.globalCompositeOperation = "source-in";
                context.drawImage(
                    image,
                    0,
                    0,
                    image.scrollWidth,
                    image.scrollHeight
                );
                image.src = canvas.toDataURL("image/png", "");
                resolve(image.src);
            };
        } else {
            context.drawImage(image, 0, 0, image.scrollWidth, image.scrollHeight);
            image.src = canvas.toDataURL("image/png", "");
            resolve(image.src);
        }
    })
}

async function addDownloadLink() {
    await saveImage();
    let link = document.createElement("a");
    link.href = image.src;
    link.innerHTML = "Download";
    link.setAttribute("download", "myImage");
    link.click();
}

editSaveButton.addEventListener('click', () => {
    mpicPopUp.style.display = "flex";
})

window.addEventListener("click", (event) => {
    if (event.target == mpicPopUp) {
        mpicPopUp.style.display = "none";
    }
});


async function postImage() {
    restoreBtn.classList.remove("hidden");
    let mpicIcon = document.getElementById("mpic-icon");
    mpicIcon.classList = "fa-solid fa-spinner fa-spin-pulse camera";
    await saveImage();
    let message = document.getElementsByClassName("mpic-text")[0].value;
    // console.log("Image source = ", image.src);
    fetch("./image", {
        method: "POST",
        body: JSON.stringify({ src: image.src, description : message })
    })
        .then((response) => {
            console.log(response.status);
            if(response.status == 201){
                mpicPopUp.style.display = "none";
                inputMpic.value = "";
            } else {
                
                let restoreColor = mpicIcon.style.color;
                mpicIcon.style.color = "hsl(0, 100%, 34%)";
                inputMpic.value = "Error, please try again ...";
                setTimeout(() => {
                    tweetIcon.style.color = restoreColor;
                    inputTweet.value = "";
                }, 2500);
            }
            mpicIcon.classList = "fa fa-camera camera";
        })
        .catch((error) => {
            console.log(error);
        });
}

async function updateImage() {
    await saveImage();
    fetch("./image", {
        method: 'PUT',
        body: JSON.stringify({id : image.getAttribute("data-mpic-id"),
            src : image.src})
    }).then((response) => {
        console.log(response);
        if(response.status == 200){
            editUpdateButton.innerText = "Updated";
            setTimeout(() => {
                editUpdateButton.innerText = "Update"
            }, 1000);
        }
    }).catch((error) => {
        console.log(error);
    })
}

image.addEventListener('mousedown', (e) => {
    if(!clip) return;
    mousedown = true;
    coordinates = [];
});

clipBtn.addEventListener('click', (e) => {
    clip = !clip;
    if(!clip) {
        image.draggable = true;
        clipBtn.classList.remove('active');
        image.style.cursor = "auto"
    } else {
        image.draggable = false;
        clipBtn.classList.add('active');
        image.style.cursor = 'crosshair';
    }
});

image.addEventListener('mousemove', (e) => {
    if(!clip) return;
    if(!mousedown) return;
    coordinates.push({x:e.offsetX, y:e.offsetY});
});

image.addEventListener('mouseup', (e) => {
    if(!clip) return;
    mousedown = false;
    console.log(restore);
    console.log(coordinates);
    restore.push(image.src);
    restoreBtn.classList.remove('hidden');
    let canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'html:canvas');
    let context = canvas.getContext('2d');
    
    canvas.height = image.scrollHeight;
    canvas.width = image.scrollWidth;

    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);
    for(let i = 0; i < coordinates.length-1; i++) {
        context.lineTo(coordinates[i+1].x, coordinates[i+1].y);
    }
    context.clip();
    context.drawImage(image, 0, 0, image.scrollWidth, image.scrollHeight);
    image.src = canvas.toDataURL('image/png', '');
    clipBtn.click();
});

function restoreImage() {
    image.src = restore.pop();
    if(restore.length == 0) {
        restoreBtn.classList.add('hidden');
    }
}
