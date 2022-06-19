let sliderContainer = document.getElementsByClassName("slider-container")[0];
let criteriaButton = document.getElementById("criteria-button");
let minDate = document.getElementById("min-date");
let maxDate = document.getElementById("max-date");
let minLikes = document.getElementById("min-likes");
let maxLikes = document.getElementById("max-likes");
let apply = document.getElementById("apply");
let selectPlatform = document.getElementById('platform-select');

apply.addEventListener("click", () => {
    sliderContainer.classList.add("hidden");
    document.querySelectorAll(".gallery-item").forEach((element) => {
        element.classList.remove("hidden");
        let likes = Number.parseInt(element.getAttribute("data-likes"));
        let date = Date.parse(element.getAttribute("data-created-at"));
        let platform = element.firstElementChild.getAttribute("data-platform");
        if (minLikes.value != "" && likes < Number.parseInt(minLikes.value)) {
            element.classList.add("hidden");
        } else if (maxLikes != "" && likes > Number.parseInt(maxLikes.value)) {
            element.classList.add("hidden");
        } else if (minDate.value != "" && date < Date.parse(minDate.value)) {
            element.classList.add("hidden");
        } else if (maxDate.value != "" && date > Date.parse(maxDate.value)) {
            element.classList.add("hidden");
        } else if (platform != null && selectPlatform.options[selectPlatform.selectedIndex].value != "" && platform != selectPlatform.options[selectPlatform.selectedIndex].value) {
            element.classList.add("hidden");
        }
    });
});

window.addEventListener('click', (e) => {
    if(!criteriaButton.contains(e.target) && !sliderContainer.contains(e.target)) {
        sliderContainer.classList.add('hidden');
    }
})

minDate.addEventListener("change", () => {
    maxDate.setAttribute("min", minDate.value);
});

maxDate.addEventListener("change", () => {
    minDate.setAttribute("max", maxDate.value);
});

minLikes.addEventListener("change", () => {
    maxLikes.setAttribute("min", Number.parseInt(minLikes.value));
});

maxLikes.addEventListener("change", () => {
    minLikes.setAttribute("max", Number.parseInt(maxLikes.value));
});

criteriaButton.addEventListener("click", () => {
    sliderContainer.classList.toggle("hidden");
});
