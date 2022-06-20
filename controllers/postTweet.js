const { auth, parseCookies, getPostData, randomStr } = require("../utils");
const fetch = require('node-fetch');
const FormData = require('form-data');
const { Headers } = require('headers-utils');
const crypto = require("crypto");
require("dotenv").config();

function getOauthSignature(host, consumer_key, consumer_secret, oauth_token, oauth_token_secret) {
    let oauth_nonce = randomStr(32, "abcdefghijklmnopqrstuvxyz0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ");
    oauth_nonce = btoa(oauth_nonce);
    console.log('oauth_nonce: ' + oauth_nonce);
    let oauth_timestamp = Math.floor(Date.now()/1000);

    let signatureBaseString = 'POST' + '&' + encodeURIComponent(host) + '&' + encodeURIComponent(encodeURIComponent('oauth_consumer_key') + '=' + encodeURIComponent(consumer_key) + '&' + encodeURIComponent('oauth_nonce') + '=' + encodeURIComponent(oauth_nonce) + '&' + encodeURIComponent('oauth_signature_method') + '=' + encodeURIComponent('HMAC-SHA1') + '&' + encodeURIComponent('oauth_timestamp') + '=' + encodeURIComponent(oauth_timestamp) + '&' + encodeURIComponent('oauth_token') + '=' + encodeURIComponent(oauth_token) + '&' + encodeURIComponent('oauth_version') + '=' + encodeURIComponent('1.0'));
    signatureBaseString = signatureBaseString.replace(/!/g, '%2521');

    console.log('signatureBaseString: ' + signatureBaseString);

    signingKey = encodeURIComponent(consumer_secret) + '&' + encodeURIComponent(oauth_token_secret);
    console.log('signing key: ' + signingKey);

    let oauth_signature = crypto.createHmac('sha1', signingKey).update(signatureBaseString).digest('base64');
    console.log('oauth_signature: ' + encodeURIComponent(oauth_signature));
    return {
        'oauth_timestamp': `${oauth_timestamp}`,
        'oauth_nonce': `${oauth_nonce}`,
        'oauth_signature': `${encodeURIComponent(oauth_signature)}`
    }
}

async function postTweetController(req, res) {
    let user = auth(req, res);
    if (!user) {
        console.log("user is not authorized for getting photos");
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Unauthorized", "utf8");
    } else {
        switch(req.method) {
            case 'POST' :
                postTweet(req, res);
                break;
            default : 
                res.writeHead(405);
                res.end();
        }
    }
}

async function postTweet(req, res) {
    let cookies = parseCookies(req);
    const consumer_key = process.env.TWITTER_CONSUMER_KEY;
    const consumer_secret = process.env.TWITTER_CONSUMER_SECRET;
    let oauth = getOauthSignature('https://upload.twitter.com/1.1/media/upload.json', consumer_key, consumer_secret, cookies.oauth_token, cookies.oauth_token_secret);

    const imageBinary = await getPostData(req);
    
    const form = new FormData();

    form.append('media_data', imageBinary.src.substring(imageBinary.src.indexOf(",") + 1));
    form.append('media_category', 'tweet_image');

    fetch(`https://upload.twitter.com/1.1/media/upload.json?oauth_consumer_key=${encodeURIComponent(consumer_key)}&oauth_token=${encodeURIComponent(cookies.oauth_token)}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=${encodeURIComponent(oauth.oauth_timestamp)}&oauth_nonce=${encodeURIComponent(oauth.oauth_nonce)}&oauth_version=1.0&oauth_signature=${oauth.oauth_signature}`, {
        method : 'POST',
        headers : {
            'Content-Transfer-Encoding': 'base64'
        },
        body: form,
        redirect : 'follow'
    }).then(async (response) => {
        response = await response.json();
        // console.log(response);

        oauth = getOauthSignature('https://api.twitter.com/2/tweets', consumer_key, consumer_secret, cookies.oauth_token, cookies.oauth_token_secret);

        let myHeaders = new Headers();
        myHeaders.append('Authorization', `OAuth oauth_consumer_key="${encodeURIComponent(consumer_key)}", oauth_token="${encodeURIComponent(cookies.oauth_token)}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${encodeURIComponent(oauth.oauth_timestamp)}", oauth_nonce="${encodeURIComponent(oauth.oauth_nonce)}", oauth_version="1.0",oauth_signature="${oauth.oauth_signature}"`)
        myHeaders.append('Content-Type', "application/json");
        fetch('https://api.twitter.com/2/tweets', {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "text": imageBinary.message,
                "media": {
                    "media_ids": [
                        `${response.media_id_string}`
                    ]
                }
            })
        }).then(async (response) => {
            response = await response.json();
            console.log(response);
            let link = response.data.text.match(/https:\/\/t\.co\/[^\s]+/)[0];
            res.writeHead(200,{'Content-Type' : 'text/plain'});
            res.end(link, 'utf8');
        }).catch(error => {
            console.log(error);
            res.writeHead(500);
            res.end();
        })
    }).catch(error => {
        console.log(error);
        res.writeHead(500);
        res.end();
    })
}

module.exports = {
    postTweetController,
};