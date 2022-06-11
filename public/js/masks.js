let imageMask = document.getElementById("image-mask");
let starMask = document.getElementById("star-mask");
let heartMask = document.getElementById("heart-mask");
let squareMask = document.getElementById("square-mask");
let cloudMask = document.getElementById("cloud-mask");
let diamondMask = document.getElementById("diamond-mask");
let cloverMask = document.getElementById("clover-mask");
let circleMask = document.getElementById("circle-mask");
let crownMask = document.getElementById("crown-mask");
let moonMask = document.getElementById("moon-mask");
let sunMask = document.getElementById("sun-mask");
localStorage.setItem("maskUrl", "");

function setMask(maskClass, maskUrl) {
    if (imageMask.classList.contains(maskClass)) {
        imageMask.classList.remove(maskClass);
        localStorage.setItem("maskUrl", "");
    } else {
        localStorage.setItem("maskUrl", maskUrl);
        imageMask.classList = `mask ${maskClass}`;
    }
}

starMask.addEventListener("click", () => {
    setMask("star-mask", '/public/images/star-solid.svg');
});

heartMask.addEventListener("click", () => {
    setMask("heart-mask", '/public/images/heart-solid.svg');
});

squareMask.addEventListener("click", () => {
    setMask("square-mask", '/public/images/square-solid.svg');
});

cloudMask.addEventListener("click", () => {
    setMask("cloud-mask", '/public/images/cloud-solid.svg');
});

diamondMask.addEventListener("click", () => {
    setMask("diamond-mask", '/public/images/diamond-solid.svg');
});

cloverMask.addEventListener("click", () => {
    setMask("clover-mask", '/public/images/clover-solid.svg');
});

circleMask.addEventListener("click", () => {
    setMask("circle-mask", '/public/images/circle-solid.svg');
});

crownMask.addEventListener('click', () => {
    setMask("crown-mask", '/public/images/crown-solid.svg');
})

moonMask.addEventListener('click', () => {
    setMask("moon-mask", '/public/images/moon-solid.svg');
})

sunMask.addEventListener('click', () => {
    setMask("sun-mask", '/public/images/sun-solid.svg');
})