var images = document.getElementsByClassName("gallery")[0];
let search = document.getElementById("search");

let watermarks = new Map();

watermarks.set("unsplash", "fab fa-unsplash");
watermarks.set("twitter", "fa fa-twitter");
watermarks.set("mpic", "fa-solid fa-camera");

let srcLink; //Tweet photo link

async function createGalleryItem(
    src,
    low,
    platform,
    id,
    created_at,
    likes,
    description,
    imageButtons
) {
    let galleryItem = document.createElement("div");
    galleryItem.classList = `gallery-item animGL ${platform}`;
    if (imageButtons == true) {
        createImageButtons().then((buttons) => {
            galleryItem.appendChild(buttons);
        });
    }
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
    galleryItem.setAttribute("data-created-at", created_at);
    if (likes != undefined) galleryItem.setAttribute("data-likes", likes);
    if (description != undefined)
        galleryItem.setAttribute("data-description", description);

    img.setAttribute("data-platform", platform);
    return galleryItem;
}

async function createImageButtons() {
    let imageButtons = document.createElement("div");
    imageButtons.classList = "image-buttons";
    // imageButtons.appendChild(createImageButton("fa fa-instagram"));
    imageButtons.appendChild(createImageButton("fa fa-twitter"));
    // imageButtons.appendChild(createImageButton("fab fa-unsplash"));
    return imageButtons;
}

function createImageButton(fontAwesomeClass) {
    let twitterPopUp = document.getElementById("twitter-pop-up");
    let imageButton = document.createElement("button");
    let icon = document.createElement("i");
    icon.classList = fontAwesomeClass;
    imageButton.appendChild(icon);
    if (fontAwesomeClass == "fa fa-twitter") {
        imageButton.addEventListener("click", (e) => {
            let twitterIcon = e.target;
            twitterPopUp.style.display = "flex";
            srcLink = twitterIcon.parentNode.parentNode.parentNode.childNodes[0]
                .getAttribute("src")
                .split("?")[0];
            e.stopImmediatePropagation();
        });
    }
    return imageButton;
}

async function uploadToTwitter(link, message) {
    let tweetIcon = document.getElementById("tweet-icon");
    tweetIcon.classList = "fa-solid fa-spinner fa-spin-pulse tweet";
    let data = await fetch(`${link}`);
    data = await data.blob();
    let fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
        let src = e.target.result;
        fetch(`./postTweet`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: message,
                src: src,
            }),
        })
            .then(async (res) => {
                tweetIcon.classList = "fa fa-twitter tweet";
                if(res.ok) {
                    res = await res.text();
                    inputTweet.value = "";
                    twitterPopUp.style.display = "none";
                    window.open(res);
                    setTimeout(() => {
                        getMyPhotos();
                    }, 9000);
                } else {
                    tweetIcon.style.color = "hsl(0, 100%, 34%)";
                    inputTweet.value = "Error, please try again ...";
                    setTimeout(() => {
                        tweetIcon.style.color = "rgb(29, 155, 240)";
                        inputTweet.value = "";
                    }, 2500);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
    fileReader.readAsDataURL(data);
}

function sendTweet() {
    let message = document.getElementsByClassName("tweet-text")[0].value;
    // console.log("Uploading to Twitter image from: " + srcLink);
    // console.log("Tweet: " + message);
    uploadToTwitter(srcLink, message);
}

function createWaterMark(fontAwesomeClass) {
    let watermark = document.createElement("div");
    watermark.classList.add("watermark");
    let icon = document.createElement("i");
    icon.classList = fontAwesomeClass;
    watermark.appendChild(icon);
    return watermark;
}
