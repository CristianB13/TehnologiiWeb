var images = document.getElementsByClassName("gallery")[0];
let search = document.getElementById("search");

let watermarks = new Map();

watermarks.set("unsplash", "fab fa-unsplash");
watermarks.set("twitter", "fa fa-twitter");
watermarks.set("mpic", "fa-solid fa-camera");

let srcLink; //Tweet photo link

// let tweetButton = document.getElementsByClassName("tweet-enter")[0];
// tweetButton.addEventListener('click', (e) => {
//     message = document.getElementsByClassName("tweet-text")[0].value;
//     console.log("tweet: " + message);
//     tweetButton.style.zIndex = "-3";
//     e.stopPropagation();
// })

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
    galleryItem.setAttribute("data-created-at", created_at);
    if (likes != undefined) galleryItem.setAttribute("data-likes", likes);
    if (description != undefined)
        galleryItem.setAttribute("data-description", description);

    img.setAttribute("data-platform", platform);
    if (platform == "mpic") {
        let deleteButton = createImageButton("fa-solid fa-trash");
        deleteButton.classList.add("delete-mpic");
        deleteButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            let response = await fetch('./image', {
                method: 'DELETE',
                body: JSON.stringify({ id : img.getAttribute("data-mpic-id")})
            });
            if(response.status == 200){
                images.removeChild(galleryItem);
            }
        })
        galleryItem.appendChild(deleteButton);
    }
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
    // imageButton.childNodes;
    let icon = document.createElement("i");
    icon.classList = fontAwesomeClass;
    imageButton.appendChild(icon);
    if(fontAwesomeClass == "fa fa-twitter") {
        imageButton.addEventListener("click", (e) => {
            let twitterIcon = e.target;
            srcLink = (((twitterIcon.parentNode).parentNode).parentNode).childNodes[0].getAttribute('src').split('?')[0];
            
            // let message = prompt("Enter the text of your tweet (max 280 characters)", "From M-PIC with LOVE");

            document.getElementsByClassName("tweet-container")[0].style.visibility = "visible";            
            // console.log("top: " + document.getElementsByClassName("tweet-container")[0].style.top);
            // uploadToTwitter(srcLink, message);
            e.stopImmediatePropagation();
        });
    } else {
        imageButton.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
        });
    }
    return imageButton;
}

function sendTweet() {
    let message = document.getElementsByClassName("tweet-text")[0].value;
    console.log('Uploading to Twitter image from: ' + srcLink);
    console.log("Tweet: " + message);
    document.getElementsByClassName("tweet-container")[0].style.visibility = "hidden";
    uploadToTwitter(srcLink, message);
}

async function uploadToTwitter(link, message) {
    let data = await fetch(
        `${link}`
    );
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
                src: src
            }),
        })
            .then(async (res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    });
    fileReader.readAsDataURL(data);
}

function createWaterMark(fontAwesomeClass) {
    let watermark = document.createElement("div");
    watermark.classList.add("watermark");
    let icon = document.createElement("i");
    icon.classList = fontAwesomeClass;
    watermark.appendChild(icon);
    return watermark;
}
