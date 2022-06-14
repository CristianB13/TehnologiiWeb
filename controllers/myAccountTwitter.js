const qs = require('querystring');
const fetch = require('node-fetch');
const request = require('request');
const util = require('util');
const post = util.promisify(request.post);
const url = require('url');

const consumer_key = 'zVG3DnEhWGO3cMOSUCrz5TwxV'; // Add your API key here
const consumer_secret = 'JBU7hqvod4VZpAC1kEZT6mHJF4QocOLFJnSoyItyeFf1QmxdI6'; // Add your API secret key here
let oAuthAccessToken;

let accessTokenURL; //= new URL('https://api.twitter.com/oauth/access_token'); //step 3

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

function myAccountTwitterController(req, res) {
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