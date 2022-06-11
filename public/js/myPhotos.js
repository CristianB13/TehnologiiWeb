let myPhotos = document.getElementById("myphotos");
myPhotos.addEventListener("click", () => getMyPhotos("unsplash"));
getMyPhotos("unsplash");

search.addEventListener("keypress", (e) => {
    if (e.code == "Enter") {
        let words = search.value.trim().split(/\s+/)
        document.querySelectorAll(".gallery-item").forEach((element) => {
            element.classList.add("hidden");
            for(let i = 0; i < words.length; i++) {
                if(new RegExp(words[i]).test(element.getAttribute('data-description'))) {
                    element.classList.remove('hidden');
                    break;
                }
            }
        });
    }
});

async function getMyPhotos(platform) {
    let response = await fetch(`./myPhotos/${platform}`, {
        method: "GET",
    });
    if (response.status >= 400) {
        // alert(await response.text());
        return;
    }
    let photos = await response.json();
    images.replaceChildren();
    for (let i = 0; i < photos.length; i++) {
        createGalleryItem(
            photos[i].urls.full + `&w=200&dpr=2`,
            photos[i].urls.thumb,
            platform,
            photos[i].id,
            photos[i].created_at,
            photos[i].likes,
            photos[i].description,
        ).then((item) => {
            images.appendChild(item);
        });
    }
}