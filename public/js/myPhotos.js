let myPhotos = document.getElementById("myphotos");
myPhotos.addEventListener("click", () => getMyPhotos("unsplash"));
getMyPhotos("unsplash");

async function getMyPhotos(platform) {
    let response = await fetch("./myPhotos", {
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
            photos[i].likes
        ).then((item) => {
            images.appendChild(item);
        });
    }
}