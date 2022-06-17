let myPhotos = document.getElementById("myphotos");
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
                    )
                ) {
                    element.classList.remove("hidden");
                    break;
                }
            }
        });
    }
});

async function getMyUnsplashPhotos() {
    let unsplashConnect = document.getElementById('unsplash-connect');
    let unsplashDisconnect = document.getElementById('unsplash-disconnect');
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
    for (let i = 0; i < photos.length; i++) {
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
            undefined,
            imageButtons
        ).then((item) => {
            images.appendChild(item);
        });
    }
}

async function getMyTwitterPhotos() {
    let twitterConnect = document.getElementById('twitter-connect');
    let twitterDisconnect = document.getElementById('twitter-disconnect');
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
    console.log(data);
    if(data.includes.users[0].profile_image_url != undefined){
        setProfilePhoto(data.includes.users[0].profile_image_url);
    }
    let k = 0;
    for (let i = 0; i < data.data.length; i++) {
        for( let j = 0; j < data.data[i].attachments.media_keys.length; j++){
            createGalleryItem(
                data.includes.media[k].url,
                data.includes.media[k].url,
                "twitter",
                data.data[i].attachments.media_keys[j],
                data.data[i].created_at,
                data.data[i].public_metrics.like_count,
                data.data[i].text,
                imageButtons
            ).then((item) => {
                if(data.data[i]?.geo?.place_id != undefined){
                    // console.log(data.data[i].geo.place_id);
                    let location = data.includes.places.filter(place => place.id == data.data[i].geo.place_id);
                    // console.log(location[0].full_name);
                    item.setAttribute("data-location", location[0].full_name);
                }
                images.appendChild(item);
            });
            k++;
        }
    }
}

function setProfilePhoto(link) {
    if (link) {
        document.getElementById('profile-photo').setAttribute('src', link);
    }
}

function getMyPhotos() {
    images.replaceChildren();
    getMyTwitterPhotos();
    getMyUnsplashPhotos();
    getMyMpicPhotos();
}
