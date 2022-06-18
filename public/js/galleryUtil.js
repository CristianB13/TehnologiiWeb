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
    if (platform == "mpic") {
        let deleteButton = createImageButton("fa-solid fa-trash");
        deleteButton.classList.add("delete-mpic");
        deleteButton.addEventListener("click", async (e) => {
            e.stopPropagation();
            let response = await fetch("./image", {
                method: "DELETE",
                body: JSON.stringify({ id: img.getAttribute("data-mpic-id") }),
            });
            if (response.status == 200) {
                images.removeChild(galleryItem);
            }
        });
        galleryItem.appendChild(deleteButton);
    }
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
                let inputTweet = document.getElementById("tweet-input");
                if(res.ok) {
                    res = await res.text();
                    inputTweet.value = "";
                    twitterPopUp.style.display = "none";
                    window.open(res);
                    setTimeout(() => {
                        getMyPhotos();
                    }, 9000);
                } else {
                    let tweetIcon = document.getElementById("tweet-icon");
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

function addPhoto() {
    console.log("addPhoto");
    document.getElementById("addPhoto-container").style.display = "flex";

    let addPhotoInput = document.getElementById("upload-input");
    addPhotoInput.addEventListener("change", async (e) => {
        console.log("Label clicked");
        let file = addPhotoInput.files[0];
        
        const name = file.name ? file.name : 'NOT SUPPORTED';
        const type = file.type ? file.type : 'NOT SUPPORTED';
        const size = file.size ? file.size : 'NOT SUPPORTED';
        console.log("file: ", file, name, type, size);
        const fileData = await getExifValues(file);
        console.log(fileData);
        //DE TRIMIS IMAGINEA SI fileData LA CLOUD #####################################
        document.getElementById("addPhoto-container").style.display = "none";
    });
}

async function getExifValues(file) {
    if (file.type && !file.type.startsWith('image/')) {
        console.log('File is not an image.', file.type, file);
        return;
    }
    
    const reader = new FileReader();
    let fileData = {
        "Device": "",
        "Model": "",
        "Software": "",
        "DateTime": "",
        "ExposureTime": "",
        "Flash": "",
        "FocalLength": "",
        "Width": "",
        "Height": "",
        "GPSLatitudeRef": "",
        "GPSLatitude": "",
        "GPSLongitudeRef": "",
        "GPSLongitude": "",
        "GPSAltitude": "",
        "Area": {
            "level1": "",
            "level2": ""
        }
    }
    reader.onloadend = (e) => {
        let exifObj = piexif.load(e.target.result);
        
        for (var ifd in exifObj) {
            if (ifd == "thumbnail") {
                continue;
            }
            //console.log("-" + ifd);
            for (var tag in exifObj[ifd]) {
                //console.log("  " + piexif.TAGS[ifd][tag]["name"] + ":" + exifObj[ifd][tag]);
                const regex = new RegExp(/\\|"|\u([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])/g);
                switch (piexif.TAGS[ifd][tag]["name"]) {
                    case "Make": fileData["Device"] = exifObj[ifd][tag].toString().trim().replaceAll(regex, "").replace(/\0/g, '');                        
                        break;
                    case "Model": fileData["Model"] = JSON.stringify(exifObj[ifd][tag]).toString().trim().replaceAll(regex, "");
                        break;
                    case "Software": fileData["Software"] = JSON.stringify(exifObj[ifd][tag]).toString().trim().replaceAll(regex, "");
                        break;
                    case "DateTime": fileData["DateTime"] = JSON.stringify(exifObj[ifd][tag]).toString().trim().replaceAll(regex, "");
                        break;
                    case "ExposureTime": fileData["ExposureTime"] = JSON.stringify(exifObj[ifd][tag][0]).toString().trim().replaceAll(regex, "");
                        break;
                    case "Flash": fileData["Flash"] = JSON.stringify(exifObj[ifd][tag]).toString().trim().replaceAll(regex, "");
                        break;
                    case "FocalLength": fileData["FocalLength"] = JSON.stringify(exifObj[ifd][tag][0]).toString().trim().replaceAll(regex, "");
                        break;
                    case "PixelXDimension": fileData["Width"] = JSON.stringify(exifObj[ifd][tag]).toString().trim().replaceAll(regex, "");
                        break;
                    case "PixelYDimension": fileData["Height"] = JSON.stringify(exifObj[ifd][tag]).toString().trim().replaceAll(regex, "");
                        break;
                    case "GPSLatitudeRef": fileData["GPSLatitudeRef"] = JSON.stringify(exifObj[ifd][tag]).toString().trim().replaceAll(regex, "");
                        break;
                    case "GPSLatitude": fileData["GPSLatitude"] = exifObj[ifd][tag];
                        break;
                    case "GPSLongitudeRef": fileData["GPSLongitudeRef"] = JSON.stringify(exifObj[ifd][tag]).toString().trim().replaceAll(regex, "");
                        break;
                    case "GPSLongitude": fileData["GPSLongitude"] = exifObj[ifd][tag];
                        break;
                    case "GPSAltitude": fileData["GPSAltitude"] = JSON.stringify(exifObj[ifd][tag][0]).toString().trim().replaceAll(regex, "");
                        break;                
                    default:
                        break;
                }
            }
        }

        fileData.Area = getGeoLocationName(fileData.GPSLatitudeRef, fileData.GPSLatitude, fileData.GPSLongitudeRef, fileData.GPSLongitude);
    }
    reader.readAsBinaryString(file);
    return fileData;
}

async function getGeoLocationName(latRef, latitude, longRef, longitude) {
    let latitudeCoord = convertDMSToDD(latitude[0][0] / latitude[0][1], latitude[1][0] / latitude[1][1], latitude[2][0] / latitude[2][1], latRef);
    let longitudeCoord = convertDMSToDD(longitude[0][0] / longitude[0][1], longitude[1][0] / longitude[1][1], longitude[2][0] / longitude[2][1], longRef);

    const querryString = encodeURIComponent(`[out:json];is_in(${latitudeCoord}, ${longitudeCoord});out;`)    
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${querryString}`);
    let area = await response.json();

    let areaName = {
        "level1": area.elements[area.elements.length - 1].tags.name,
        "level2": area.elements[area.elements.length - 2].tags.name
    };
    return areaName;
}

function convertDMSToDD(degrees, minutes, seconds, direction) {   
    let dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);
    
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    }
    return dd;
}