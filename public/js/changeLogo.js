let logo = document.getElementsByClassName('logo')[0].getElementsByTagName('img')[0];
if(localStorage.getItem("theme") == "dark"){
    logo.setAttribute("src","../public/images/logo1.png");
} else {
    logo.setAttribute("src","../public/images/logo2.png");
}

document.getElementById("theme").addEventListener("click", () => {
    let logo = document.getElementsByClassName('logo')[0].getElementsByTagName('img')[0];
    if(localStorage.getItem("theme") == "dark"){
        logo.setAttribute("src","../public/images/logo1.png");
    } else {
        logo.setAttribute("src","../public/images/logo2.png");
    }
});

