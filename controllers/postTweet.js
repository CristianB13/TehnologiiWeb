const { parseCookies, getPostData } = require("../utils");
const fetch = require('node-fetch');
const FormData = require('form-data');
const { Headers } = require('headers-utils');

async function postTweetController(req, res) {
    let cookies = parseCookies(req);
    const consumer_key = 'zVG3DnEhWGO3cMOSUCrz5TwxV';
    const imageBinary = await getPostData(req);

    const form = new FormData();

    form.append('media_data', imageBinary.src.substring(imageBinary.src.indexOf(",") + 1));
    form.append('media_category', 'tweet_image');

    fetch(`https://upload.twitter.com/1.1/media/upload.json?media_category=tweet_image&oauth_consumer_key=${consumer_key}&oauth_token=${cookies.oauth_token}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1655214438&oauth_nonce=4hfMCrR4EZ8&oauth_version=1.0&oauth_signature=bXp%2FDeVONhHfXFodAtU1vVtH9T0%3D`, {
        method : 'POST',
        headers : {
            'Content-Transfer-Encoding': 'base64'
        },
        body: form,
        redirect : 'follow'
    }).then(async (response) => {
        response = await response.json();
        console.log("FIRST RESPONSE: ", response);
        let myHeaders = new Headers();
        myHeaders.append('Authorization', `OAuth oauth_consumer_key="${consumer_key}", oauth_token="${cookies.oauth_token
        }", oauth_signature_method="HMAC-SHA1"`)
        myHeaders.append('Content-Type', "application/json");
        fetch('https://api.twitter.com/2/tweets', {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "text": "From M-PIC with LOVE",
                "media": {
                    "media_ids": [
                        `${response.media_id}`
                    ]
                }
            })
        }).then(async (response) => {
            response = await response.json();
            console.log(response);
            res.writeHead(200);
            res.end();
        }).catch(error => {
            console.log(error);
            res.writeHead(500);
            res.end();
        })
    }).catch(error => {
        console.log("FIRST ERROR", error);
        res.writeHead(500);
        res.end();
    })
}

module.exports = {
    postTweetController,
};