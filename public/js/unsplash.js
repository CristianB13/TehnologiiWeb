let req = {
    client_id: "Q2omyurFpHrenFYhW8xl_lArcGK84ZLkkjZjA0Mi_UM",
    redirect_uri: `https://m-pic.herokuapp.com/unsplash`,
    response_type: "code",
    scope: "public+read_user+write_user+read_photos+write_photos"
}

function connect() {
    window.open(`https://unsplash.com/oauth/authorize?client_id=${req.client_id}&redirect_uri=${req.redirect_uri}&response_type=code&scope=${req.scope}`, "_self");
}

async function disconnect(platform){
    fetch(`./disconnect/${platform}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({platform : `${platform}`})
    }).then(async (res) => {
        console.log("disconnected");
        if(res.status == 200){
            console.log(platform);
            document.getElementById(`${platform}-disconnect`).classList.add('hidden');
            document.getElementById(`${platform}-connect`).classList.remove('hidden');
            let children = images.children;
            Array.from(children).forEach(child => {
                if(child.classList.contains(platform)) {
                    images.removeChild(child);
                }
            })
        } else {
            alert(await res.text());
        }
    }).catch(err => {
        console.log(err);
    })
}