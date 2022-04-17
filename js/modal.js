let modal = document.getElementById('modal');
let img = modal.getElementsByTagName('img')[0];
let closeBtnModal = document.getElementById('close-btn-modal');
function modalFunction(e) {
    modal.style.display = 'flex';
    img.src = e.src;
    img.alt = e.alt;
    document.documentElement.style.overflow = "hidden";
}

window.addEventListener("click", (event) => {
    if(event.target == modal) {
        modal.style.display = 'none';
        document.documentElement.style.overflow = "auto";
    }
});

closeBtnModal.addEventListener("click", () => {
    modal.style.display = 'none'
    document.documentElement.style.overflow = "auto";
});