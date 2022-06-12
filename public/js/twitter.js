
async function twitter() {
    fetch("./myAccountTwitter", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "text/html",
            }
    }).then(response => response.text())
    .then(link => {  
        window.location = link;
    }).catch(err => console.log("error: " + err))
}
