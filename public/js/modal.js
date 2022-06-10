let modal = document.getElementById("modal");
let img = modal.getElementsByTagName("img")[0];
let closeBtnModal = document.getElementById("close-btn-modal");
let imageInfo = document.getElementsByClassName("image-info")[0];

async function modalFunction(e) {
    modal.style.display = "flex";
    img.src = e.src.replace("&w=200", "&w=400");
    img.alt = e.alt;
    let data = await getImageInfo(e.getAttribute("data-unsplash-id"));
    console.log(data);
    console.log(e.getAttribute("data-unsplash-id"));
    imageInfo.replaceChildren();

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

async function getImageInfo(id) {
    let res = await fetch(`./unsplash/photos?id=${id}`, {
        method: "GET",
    });
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
    }
});

closeBtnModal.addEventListener("click", () => {
    modal.style.display = "none";
});
