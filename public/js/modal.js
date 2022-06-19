let modal = document.getElementById("modal");
let twitterPopUp = document.getElementById("twitter-pop-up");
let uploadModal = document.getElementById('upload-modal');
let img = modal.getElementsByTagName("img")[0];
let closeBtnModal = document.getElementById("close-btn-modal");
let imageInfo = document.getElementsByClassName("image-info")[0];

async function modalFunction(e) {
    imageInfo.classList.remove("hidden");
    modal.style.display = "flex";
    img.src = e.firstChild.src.replace("&w=200", "&w=400");
    img.alt = e.firstChild.alt;

    if(e.firstChild.hasAttribute("data-mpic-id")){
        imageInfo.classList.add("hidden");
        let data = await getMpicImageInfo(e.firstChild.getAttribute("data-mpic-id"));
        let exif_data = JSON.parse(data.exif_data);
        if(data != false){
            imageInfo.replaceChildren();
            displayMpicImageInfo(exif_data, data.src, data.description);   
        }
    } else {
        let platform = e.firstChild.getAttribute("data-platform");
        imageInfo.replaceChildren();
        if(platform == "unsplash"){
            imageInfo.classList.add("hidden");
            let data = await getImageInfo(e.firstChild.getAttribute(`data-${platform}-id`), platform);
            if(data != false){
                displayUnsplashImageInfo(data);
                imageInfo.classList.remove("hidden");   
            }
        } else if(platform == "twitter"){
            let link = e.getAttribute("data-description").match(/https:\/\/t\.co\/[^\s]+/g).pop();
            let description = e.getAttribute("data-description").replaceAll(/https:\/\/t\.co\/[^\s]+/g, "");
            description = description.replaceAll(/#[a-z0-9_]+/g, "");
            console.log(description);
            let tags = e.getAttribute("data-description").match(/#[a-z0-9_]+/g)?.map(e => {
                let obj = {};
                obj.title = e.replace("#", "");
                return obj;
            });
            
            let data = {
                "description" : description,
                "location" : e.getAttribute("data-location"),
                "likes" : e.getAttribute("data-likes"),
                "link" : link,
                "tags" : tags
            }
            displayTwitterImageInfo(data);
        }
    }
}

async function getMpicImageInfo(id){
    let response = await fetch(`./image?id=${id}`, {
        method : 'GET'
    });
    if(response.ok){
        response = await response.json();
        // console.log(response.exif_data);
        return response;
    } else {
        return false;
    }
}

function displayMpicImageInfo(data, src, description){
    imageInfo.replaceChildren();
    if (description != "") {
        imageInfo.classList.remove("hidden");
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-feather-pointed",
                description,
                "info-type2"
            )
        );
    }
    if(data == null || data.Device == "") return;
    imageInfo.classList.remove("hidden");
    if (data.Device != "") {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-mobile-screen",
                `${data.Device}, ${data.Model}`,
                "info-type2"
            )
        );
    }
    if (data.Area.level1 != "") {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-location-dot",
                `${data.Area.level1}, ${data.Area.level2}`,
                "info-type2"
            )
        );
    }

    if (data.DateTime != "") {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-clock",
                data.DateTime,
                "info-type2"
            )
        );
    }

    if (data.Software != "") {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-circle-info",
                `Software : ${data.Software}`,
                "info-type2"
            )
        );
    }

    
    if (data.ExposureTime != "") {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-circle-info",
                `Exposure Time : ${data.ExposureTime}`,
                "info-type2"
            )
        );
    }

    if (data.Flash != "") {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-bolt",
                `Flash : ${data.Flash}`,
                "info-type2"
            )
        );
    }

    if (data.FocalLength != "") {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-circle-info",
                `Focal Length : ${data.FocalLength}`,
                "info-type2"
            )
        );
    }

    
    if (data.Width != "") {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-compress",
                `Width ${data.Width}, Height ${data.Height}`,
                "info-type2"
            )
        );
    }

    if (data.GPSLatitudeRef != "") {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-globe",
                `${data.GPSLatitude[0][0]/data.GPSLatitude[0][1]} ${data.GPSLatitudeRef}, ${data.GPSLongitude[0][0]/data.GPSLongitude[0][1]} ${data.GPSLongitudeRef}`,
                "info-type2"
            )
        );
    }
}

function displayUnsplashImageInfo(data){
    if (data.description != null) {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-feather-pointed",
                data.description,
                "info-type2"
            )
        );
    }
    if (data.location.name != null) {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-location-dot",
                data.location.name,
                "info-type2"
            )
        );
    }
    if (data.tags.length != 0) {
        imageInfo.appendChild(createTags(data.tags));
    }

    let infoTypeContainer = document.createElement("div");
    infoTypeContainer.classList = "info-type1-container";
    infoTypeContainer.appendChild(
        createIcon("fa-solid fa-heart", data.likes, "info-type1")
    );
    infoTypeContainer.appendChild(
        createIcon("fa-solid fa-cloud-arrow-down", data.downloads, "info-type1")
    );
    infoTypeContainer.appendChild(
        createIcon("fa-solid fa-eye", data.views, "info-type1")
    );

    let linksContainer = document.createElement("div");
    linksContainer.classList = "info-type1-container";
    let link = document.createElement("a");
    link.href = data.links.html;
    link.target = "_blank";
    let linkIcon = document.createElement("i");
    linkIcon.classList = "fa-solid fa-link";
    link.appendChild(linkIcon);
    linksContainer.appendChild(link);

    let downloadLink = document.createElement("a");
    downloadLink.href = data.links.download + "&force=true";
    downloadLink.target = "_blank";
    let downloadIcon = document.createElement("i");
    downloadIcon.classList = "fa-solid fa-download";
    downloadLink.appendChild(downloadIcon);
    downloadLink.setAttribute("download", "");
    linksContainer.appendChild(downloadLink);

    imageInfo.appendChild(infoTypeContainer);
    imageInfo.appendChild(linksContainer);
}

function displayTwitterImageInfo(data){
    if (data.description != "") {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-feather-pointed",
                data.description,
                "info-type2"
            )
        );
    }
    if (data.location != null) {
        imageInfo.appendChild(
            createIcon(
                "fa-solid fa-location-dot",
                data.location,
                "info-type2"
            )
        );
    }

    if (data.tags != undefined) {
        imageInfo.appendChild(createTags(data.tags));
    }

    let infoTypeContainer = document.createElement("div");
    infoTypeContainer.classList = "info-type1-container";
    infoTypeContainer.appendChild(
        createIcon("fa-solid fa-heart", data.likes, "info-type1")
    );

    let linksContainer = document.createElement("div");
    linksContainer.classList = "info-type1-container";
    let link = document.createElement("a");
    link.href = data.link;
    link.target = "_blank";
    let linkIcon = document.createElement("i");
    linkIcon.classList = "fa-solid fa-link";
    link.appendChild(linkIcon);
    linksContainer.appendChild(link);

    imageInfo.appendChild(infoTypeContainer);
    imageInfo.appendChild(linksContainer);
}

async function getImageInfo(id, platform) {
    let res = await fetch(`./${platform}/photos?id=${id}`, {
        method: "GET",
    });
    if(res.status == 403)
        return false;
    res = await res.json();
    return res;
}

function createIcon(iconClass, info, infoClass) {
    let el = document.createElement("div");
    el.classList.add("info");
    let p = document.createElement("p");
    p.innerText = info;
    p.classList.add(infoClass);
    let icon = document.createElement("i");
    icon.classList = iconClass;
    el.appendChild(icon);
    el.appendChild(p);
    return el;
}

function createTags(tags) {
    let container = document.createElement("div");
    container.classList.add("tags");
    let icon = document.createElement("i");
    icon.classList = "fa-solid fa-tags";
    container.appendChild(icon);
    for (let i = 0; i < tags.length; i++) {
        let tag = document.createElement("div");
        tag.classList.add("tag");
        tag.innerHTML = tags[i].title;
        container.appendChild(tag);
    }
    return container;
}

window.addEventListener("click", (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    } else if(event.target == twitterPopUp) {
        twitterPopUp.style.display = "none";
    } else if(event.target == uploadModal){
        uploadModal.style.display = "none";
    }
});

closeBtnModal.addEventListener("click", () => {
    modal.style.display = "none";
});

function removeImageInfo(){
    imageInfo.replaceChildren();
}