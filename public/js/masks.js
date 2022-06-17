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
let activeMask;
localStorage.setItem("maskUrl", "");

function setMask(maskClass, maskUrl, maskBtn) {
    if (imageMask.classList.contains(maskClass)) {
        imageMask.classList.remove(maskClass);
        localStorage.setItem("maskUrl", "");
        activeMask.classList.remove('active');
    } else {
        localStorage.setItem("maskUrl", maskUrl);
        imageMask.classList = `mask ${maskClass}`;
        if(activeMask) {
            activeMask.classList.remove('active');
        }
        activeMask = maskBtn;
        if(activeMask) {
            activeMask.classList.add('active');
        }
    }
}

starMask.addEventListener("click", () => {
    setMask("star-mask", '/public/images/star-solid.svg', starMask);
});

heartMask.addEventListener("click", () => {
    setMask("heart-mask", '/public/images/heart-solid.svg', heartMask);
});

squareMask.addEventListener("click", () => {
    setMask("square-mask", '/public/images/square-solid.svg', squareMask);
});

cloudMask.addEventListener("click", () => {
    setMask("cloud-mask", '/public/images/cloud-solid.svg', cloudMask);
});

diamondMask.addEventListener("click", () => {
    setMask("diamond-mask", '/public/images/diamond-solid.svg', diamondMask);
});

cloverMask.addEventListener("click", () => {
    setMask("clover-mask", '/public/images/clover-solid.svg', cloverMask);
});

circleMask.addEventListener("click", () => {
    setMask("circle-mask", '/public/images/circle-solid.svg', circleMask);
});

crownMask.addEventListener('click', () => {
    setMask("crown-mask", '/public/images/crown-solid.svg', crownMask);
});

moonMask.addEventListener('click', () => {
    setMask("moon-mask", '/public/images/moon-solid.svg', moonMask);
});

sunMask.addEventListener('click', () => {
    setMask("sun-mask", '/public/images/sun-solid.svg', sunMask);
});