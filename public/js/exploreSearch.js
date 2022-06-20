search.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        searchImages(search.value);
    }
});

searchImages("nature");

function searchImages(value) {
    images.replaceChildren();
    searchMpic(value);
    setTimeout(() => {
        searchUnsplash(value);
    }, 1000);
    // setTimeout(() => {
    //     searchTwitter(value);
    // }, 1000);
}

function searchUnsplash(value) {
    // for(let i = 0; i < 5; i++) {
    let page = Math.floor(Math.random() * 10);
    fetch(
        `https://api.unsplash.com/search/photos?query=${value}&per_page=30&page=${page}&client_id=gK52De2Tm_dL5o1IXKa9FROBAJ-LIYqR41xBdlg3X2k`
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            // console.log("AICI", response);
            for (let i = 0; i < response.results.length; i++) {
                createGalleryItem(
                    response.results[i].urls.full + `&w=200&dpr=2`,
                    response.results[i].urls.thumb,
                    "unsplash",
                    response.results[i].id,
                    response.results[i].created_at,
                    response.results[i].likes,
                    undefined,
                    false
                ).then((item) => {
                    images.appendChild(item);
                });
            }
        });
    // }
}

function searchTwitter(value) {
    fetch(`./twitter/random?keyword=${value}`, {
        method: "GET",
    })
        .then(async (response) => {
            let data = await response.json();
            // console.log(data);
            let k = 0;
            let frequency = [];
            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].attachments == undefined) continue;
                for (
                    let j = 0;
                    j < data.data[i].attachments.media_keys.length;
                    j++
                ) {
                    if (
                        frequency.includes(
                            data.data[i].attachments.media_keys[j]
                        )
                    )
                        continue;
                    frequency.push(data.data[i].attachments.media_keys[j]);
                    if (data.includes.media[k].type != "photo") {
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
                            item.setAttribute(
                                "data-location",
                                location[0].full_name
                            );
                        }
                        images.appendChild(item);
                    });
                    k++;
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

function searchMpic(value) {
    fetch(`./mpic/random?keyword=${value}`, {
        method: "GET",
    })
        .then(async (response) => {
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
                    false
                ).then((item) => {
                    images.appendChild(item);
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
