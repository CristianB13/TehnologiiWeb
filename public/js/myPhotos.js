let myPhotos = document.getElementById("myphotos");
let unsplashConnect = document.getElementById("unsplash-connect");
let unsplashDisconnect = document.getElementById("unsplash-disconnect");
let uploadFile = document.getElementById("upload-file");
let uploadedFile = document.getElementById("uploaded-file");
let uploadImageButton = document.getElementById('button-upload-image');
let inputTweet = document.getElementById("tweet-input");

inputTweet.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        sendTweet();
    }
});

myPhotos.addEventListener("click", () => getMyPhotos());
let imageButtons = true;
getMyPhotos();

search.addEventListener("keypress", (e) => {
    if (e.code == "Enter") {
        let words = search.value.trim().split(/\s+/);
        document.querySelectorAll(".gallery-item").forEach((element) => {
            element.classList.add("hidden");
            for (let i = 0; i < words.length; i++) {
                if (
                    new RegExp(words[i]).test(
                        element.getAttribute("data-description")
                    ) || element.getAttribute("data-description") == undefined
                ) {
                    element.classList.remove("hidden");
                    break;
                }
            }
        });
    }
});

async function getMyUnsplashPhotos() {
    let response = await fetch("./myPhotos/unsplash", {
        method: "GET",
    });
    if (response.status >= 400) {
        unsplashDisconnect.classList.add("hidden");
        unsplashConnect.classList.remove("hidden");
        // alert(await response.text());
        return;
    }
    let photos = await response.json();
    for (let i = 0; i < photos.length - 1; i++) {
        createGalleryItem(
            photos[i].urls.full + `&w=200&dpr=2`,
            photos[i].urls.thumb,
            "unsplash",
            photos[i].id,
            photos[i].created_at,
            photos[i].likes,
            photos[i].description,
            imageButtons
        ).then((item) => {
            images.appendChild(item);
        });
    }
    // console.log("Unsplash profile picture", photos[photos.length-1]);
    if (photos[photos.length - 1].unsplash_profile_picture != undefined) {
        setProfilePhoto(
            photos[photos.length - 1].unsplash_profile_picture + "&w=400&h=400"
        );
    }
    unsplashDisconnect.classList.remove("hidden");
    unsplashConnect.classList.add("hidden");
}

async function getMyMpicPhotos() {
    let response = await fetch("./image", {
        method: "GET",
    });
    let photos = await response.json();
    for (let i = 0; i < photos.length; i++) {
        createGalleryItem(
            photos[i].src,
            photos[i].src,
            "mpic",
            photos[i].id,
            photos[i].created_at,
            0,
            photos[i].description,
            imageButtons
        ).then((item) => {            
            let deleteButton = createImageButton("fa-solid fa-trash");
            deleteButton.classList.add("delete-mpic");
            deleteButton.addEventListener("click", async (e) => {
                e.stopPropagation();
                let response = await fetch("./image", {
                    method: "DELETE",
                    body: JSON.stringify({ id: photos[i].id }),
                });
                console.log(response.status);
                if (response.ok || response.status == 404) {
                    images.removeChild(item);
                }
            });
            item.appendChild(deleteButton);
            let lockButton;
            if(photos[i].access == false)
                lockButton = createImageButton("fa-solid fa-lock");
            else 
                lockButton = createImageButton("fa-solid fa-unlock");
            lockButton.classList.add('lock-mpic');

            lockButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                let access = true;
                if(lockButton.firstElementChild.classList.contains('fa-lock')) {
                    access = false;
                }
                let response = await fetch('./image', {
                    method: 'PUT',
                    body : JSON.stringify({"id" : photos[i].id, "access" : !access})
                });
                if(response.ok) {
                    response = await response.json();
                    console.log(response);
                    if(response.access == false ) {
                        lockButton.firstElementChild.classList = "fa-solid fa-lock";
                    } else {
                        lockButton.firstElementChild.classList = "fa-solid fa-unlock";
                    }
                } else if(response.status == 404){
                    images.removeChild(item);
                }
            })

            item.appendChild(lockButton);
            images.appendChild(item);
        });
    }
}

async function getMyTwitterPhotos() {
    let twitterConnect = document.getElementById("twitter-connect");
    let twitterDisconnect = document.getElementById("twitter-disconnect");
    let response = await fetch("./myPhotos/twitter", {
        method: "GET",
    });
    if (response.status >= 400) {
        twitterDisconnect.classList.add("hidden");
        twitterConnect.classList.remove("hidden");
        imageButtons = false;
        return;
    }
    twitterDisconnect.classList.remove("hidden");
    twitterConnect.classList.add("hidden");
    imageButtons = true;
    let data = await response.json();
    // console.log(data);
    if (data.includes.users[0].profile_image_url != undefined) {
        setProfilePhoto(
            data.includes.users[0].profile_image_url.replace("_normal", "")
        );
    }
    let k = 0;
    let frequency = [];
    for (let i = 0; i < data.data.length; i++) {
        if(data.data[i].attachments == undefined) continue;
        for (let j = 0; j < data.data[i].attachments.media_keys.length; j++) {
            if(frequency.includes(data.data[i].attachments.media_keys[j])) continue;
            frequency.push(data.data[i].attachments.media_keys[j]);
            if(data.includes.media[k].type != 'photo'){
                k++;
                continue;
            }
            createGalleryItem(
                data.includes.media[k].url,
                data.includes.media[k].url,
                "twitter",
                data.data[i].attachments.media_keys[j],
                data.data[i].created_at,
                data.data[i].public_metrics.like_count,
                data.data[i].text,
                false
            ).then((item) => {
                if (data.data[i]?.geo?.place_id != undefined) {
                    // console.log(data.data[i].geo.place_id);
                    let location = data.includes.places.filter(
                        (place) => place.id == data.data[i].geo.place_id
                    );
                    // console.log(location[0].full_name);
                    item.setAttribute("data-location", location[0].full_name);
                }
                images.appendChild(item);
            });
            k++;
        }
    }
}

uploadFile.addEventListener("change", () => {
    if (uploadFile.value == "") {
        uploadedFile.innerText = "";
    } else {
        uploadedFile.innerText = uploadFile.value.replace("C:\\fakepath\\", "");
    }
});

function setProfilePhoto(link) {
    if (link) {
        document.getElementById("profile-photo").setAttribute("src", link);
    }
}

function getMyPhotos() {
    let uploadImage = document.getElementById(
        "button-upload-image"
    ).parentElement;
    images.replaceChildren();
    images.appendChild(uploadImage);
    getMyTwitterPhotos();
    getMyUnsplashPhotos();
    getMyMpicPhotos();
}

async function uploadImage() {
    let uploadSubmitButton = document.getElementById('upload-submit-button');
    if(uploadFile.files.length < 1){
        return;
    }
    uploadSubmitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin-pulse"></i>';
    let uploadDescription = document.getElementById('upload-description');
    let form = new FormData();
    form.append("image", uploadFile.files[0]);
    form.append("description", uploadDescription.value);
    let fileData = await getExifValues(uploadFile.files[0]);
    // console.log(JSON.stringify(fileData));
    form.append("exif", JSON.stringify(fileData));
    fetch('./upload', {
        method : 'POST',
        body : form
    }).then((response) => {
        if(response.ok){
            uploadFile.value = "";
            uploadedFile.innerText = "";
            uploadDescription.value = "";
            uploadModal.style.display = "none";
            uploadSubmitButton.innerText = "Submit";
            getMyPhotos();
        } else {
            uploadedFile.innerText = "Sorry, something went wrong ..."
        }
    }).catch((error) => {
        console.log(error);
    })
}

uploadImageButton.addEventListener('click', () => {
    uploadModal.style.display = "flex";
})

async function getExifValues(file) {
    return new Promise((resolve, reject) => {
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
        if (file.type && !file.type.startsWith('image/')) {
            console.log('File is not an image.', file.type, file);
            resolve(fileData);
        }
        reader.onloadend = async (e) => {
            let exifObj = piexif.load(e.target.result);
            
            for (var ifd in exifObj) {
                if (ifd == "thumbnail") {
                    continue;
                }
                //console.log("-" + ifd);
                for (let tag in exifObj[ifd]) {
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
                            // console.log("TAG:", piexif.TAGS[ifd][tag]["name"]);
                            break;
                    }
                }
            }
            // console.log(fileData.GPSLatitudeRef, fileData.GPSLatitude, fileData.GPSLongitudeRef, fileData.GPSLongitude);
            if(fileData.GPSAltitude != undefined && fileData.GPSLongitude)
                fileData.Area = await getGeoLocationName(fileData.GPSLatitudeRef, fileData.GPSLatitude, fileData.GPSLongitudeRef, fileData.GPSLongitude);
            resolve(fileData);
        }
        reader.readAsBinaryString(file);
    });
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