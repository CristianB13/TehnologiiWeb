const https = require('https');
const fs = require('fs');
const { parseCookies } = require("../utils");
const qs = require('querystring');
const url = require('url');


async function postTweetController(req, res) {
    
    //receive image and upload it to Twitter
    let cookies = parseCookies(req);
    const consumer_key = 'zVG3DnEhWGO3cMOSUCrz5TwxV';
    //avem nevoie de titlu imaginii:    ...                 ${filename}
    //              tipul imaginii: jpg, jpeg, png, gif ...    ${ type }
    const imageData = qs.parse(req.url);
    //              si de "raw binary of the image"
    const imageBinary = req.body.toString();
    //raspunsul la upload e un media_id
    let media_id;

    let options = {
        'method': 'POST',
        'hostname': 'upload.twitter.com',
        'path': `/1.1/media/upload.json?oauth_consumer_key=${consumer_key}&oauth_token=${cookies.oauth_token}`,
        'headers': {    },
        'maxRedirects': 20
    };

    var photoUpload = https.request(options, function (response) {
        media_id = await response.json().media_id;
        
        response.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = `------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"media\"; filename=\"${imageData.filename}\"\r\nContent-Type: \"image/${imageData.type}\"\r\n\r\n" + ${imageBinary} + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"media_category\"\r\n\r\ntweet_image\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--`;

    photoUpload.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

    photoUpload.write(postData);

    photoUpload.end();

    // postam tweet cu media_id asignata pozei uploadate

    options = {
    'method': 'POST',
    'hostname': 'api.twitter.com',
    'path': '/2/tweets',
    'headers': {
        'Authorization': `OAuth oauth_consumer_key="${consumer_key}",oauth_token="${cookies.oauth_token}"`,
        'Content-Type': 'application/json',
    },
    'maxRedirects': 20
    };

    var tweet = https.request(options, function (response) {
        let tweetResponse = await response.json();
        console.log(tweetResponse.toString());

        res.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = JSON.stringify({
    "text": "From M-PIC with LOVE",
    "media": {
        "media_ids": [
        `${media_id}`
        ]
    }
    });

    req.write(postData);

    req.end();

}

module.exports = {
    postTweetController,
};