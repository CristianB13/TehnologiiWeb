const qs = require('querystring');
const request = require('request');
const util = require('util');
const post = util.promisify(request.post);
const url = require('url');
require("dotenv").config();

const consumer_key = process.env.TWITTER_CONSUMER_KEY; // Add your API key here
const consumer_secret =  process.env.TWIITER_CONSUMER_SECRET; // Add your API secret key here
let oAuthAccessToken;

let accessTokenURL; //= new URL('https://api.twitter.com/oauth/access_token'); //step 3

function myAccountTwitterController(req, res) {
    switch(req.method) {
        case 'GET' : 
            myAccountTwitter(req, res);
            break;
        default : 
            res.writeHead(405);
            res.end();
    }
}

async function accessToken(oauth_token, oauth_token_secret, verifier) {
    const oAuthConfig = {
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
        token: oauth_token,
        token_secret: oauth_token_secret,
        verifier: verifier,
    };

    accessTokenURL = new URL('https://api.twitter.com/oauth/access_token');
    const req = await post({url: accessTokenURL, oauth: oAuthConfig});

    if (req.body) {
        return qs.parse(req.body);
    } else {
        throw new Error('Cannot get an OAuth request token');
    }
}

async function myAccountTwitter(req, res) {
    (async () => {
        try {
            // fetch the request token
            const oauth = url.parse(req.url, true).query;
            // Get the access token
            oAuthAccessToken = await accessToken(oauth.oauth_token, oauth.oauth_token_secret, oauth.oauth_verifier);

            res.writeHead(303, [['Location', 'https://m-pic.herokuapp.com/myAccount'],
            ['Set-Cookie', `oauth_token=${oAuthAccessToken.oauth_token}; Max-Age=2147483647; HttpOnly; SameSite=None; Secure;`],
            ['Set-Cookie', `oauth_token_secret=${oAuthAccessToken.oauth_token_secret}; Max-Age=2147483647; HttpOnly; SameSite=None; Secure;`],
            ['Set-Cookie', `user_id=${oAuthAccessToken.user_id}; Max-Age=2147483647; HttpOnly; SameSite=None; Secure;`],
            ['Set-Cookie', `user_username=${oAuthAccessToken.screen_name}; Max-Age=2147483647; HttpOnly; SameSite=None; Secure;`],
            ]);
            res.end();
        } catch (e) {
            console.error(e);
        }
    })();
}
module.exports = {
    myAccountTwitterController
}