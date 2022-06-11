search.addEventListener("keypress", (e) => {
    if (e.code == "Enter") {
        searchImages(search.value);
    }
});

searchImages("random");

function searchImages(value) {
    images.replaceChildren();
    for(let i = 0; i < 5; i++) {
        fetch(
            `https://api.unsplash.com/search/photos?query=${value}&per_page=30&page=${i}&client_id=gK52De2Tm_dL5o1IXKa9FROBAJ-LIYqR41xBdlg3X2k`
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                console.log(response);
                for (let i = 0; i < response.results.length; i++) {
                    createGalleryItem(
                        response.results[i].urls.full + `&w=200&dpr=2`,
                        response.results[i].urls.thumb,
                        "unsplash",
                        response.results[i].id,
                        response.results[i].created_at,
                        response.results[i].likes
                    ).then((item) => {
                        images.appendChild(item);
                    });
                }
            });
    }
}