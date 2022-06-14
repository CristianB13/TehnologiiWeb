var images = document.getElementsByClassName("gallery")[0];
let search = document.getElementById("search");

let watermarks = new Map();

watermarks.set("unsplash", "fab fa-unsplash");
watermarks.set("twitter", "fa fa-twitter");
watermarks.set("mpic", "fa-solid fa-camera");

async function createGalleryItem(src, low, platform, id, created_at, likes, description) {
    let galleryItem = document.createElement("div");
    galleryItem.classList = `gallery-item animGL ${platform}`;
    createImageButtons().then((buttons) => {
        galleryItem.appendChild(buttons);
    });
    let x = new Image();
    x.src = src;
    let img = new Image();
    galleryItem.setAttribute("onclick", "modalFunction(this);");
    img.setAttribute(`data-${platform}-id`, id);
    img.setAttribute("loading", "lazy");
    img.src = low;
    img.style.filter = "blur(10px)";
    x.addEventListener("load", () => {
        img.style.filter = "";
        img.src = x.src;
    });
    galleryItem.appendChild(img);
    galleryItem.appendChild(createWaterMark(watermarks.get(platform)));
    galleryItem.setAttribute('data-created-at', created_at);
    if(likes != undefined)
        galleryItem.setAttribute('data-likes', likes);
    if(description != undefined)
        galleryItem.setAttribute('data-description', description);

    img.setAttribute('data-platform', platform);
    return galleryItem;
}

async function createImageButtons() {
    let imageButtons = document.createElement("div");
    imageButtons.classList = "image-buttons";
    // imageButtons.appendChild(createImageButton("fa fa-instagram"));
    imageButtons.appendChild(createImageButton("fa fa-twitter"));
    imageButtons.appendChild(createImageButton("fab fa-unsplash"));
    return imageButtons;
}

function createImageButton(fontAwesomeClass) {
    let imageButton = document.createElement("button");
    imageButton.addEventListener("onclick", (this, uploadToTwitter()));
    let icon = document.createElement("i");
    icon.classList = fontAwesomeClass;
    imageButton.appendChild(icon);
    return imageButton;
}

function uploadToTwitter() {

    let image;
    const reader = new FileReader();
    reader.onload = function () {
        console.log("IMAGE FILE: " + reader.result);
        image = reader.result;
      }
    
    reader.readAsBinaryString(new File("../images/darkBackground.jpg"));

    fetch(`./postTweet/?filename=test&type=jpg`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "image/jpg",
        },
        body: image
    }).then(async (res) => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

function createWaterMark(fontAwesomeClass) {
    let watermark = document.createElement("div");
    watermark.classList.add("watermark");
    let icon = document.createElement("i");
    icon.classList = fontAwesomeClass;
    watermark.appendChild(icon);
    return watermark;
}
