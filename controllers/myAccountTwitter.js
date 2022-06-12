const qs = require('querystring');
const request = require('request');
const util = require('util');
const get = util.promisify(request.get);
const post = util.promisify(request.post);
const url = require('url');
const https = require('https');
const fs = require('fs');
const {viewMyAccount} = require('../views/templates');

const consumer_key = '9r1Ir7dTwuLsrBhUkULJWbzjN'; // Add your API key here
const consumer_secret = 'GcebutfcqHxONoVDlTOhF3pPHJ9gWwD7Q4Dh9rNl5JW5pzq6j4'; // Add your API secret key here
let oAuthAccessToken;

let requestTokenURL; //= new URL('https://api.twitter.com/oauth/request_token'); //step 1
let authorizeURL; //= new URL('https://api.twitter.com/oauth/authorize'); //step 2
let accessTokenURL; //= new URL('https://api.twitter.com/oauth/access_token'); //step 3

async function requestToken() {
    const oAuthConfig = {
        callback: 'https://twmypictures.herokuapp.com/myAccountTwitter',
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
    };
    
    requestTokenURL = new URL('https://api.twitter.com/oauth/request_token');
    const req = await post({url: requestTokenURL, oauth: oAuthConfig});

    if (qs.parse(req.body).oauth_callback_confirmed) {
        return qs.parse(req.body);
    } else {
        throw new console.error('Cannot get an OAuth request token');
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

async function getRequest(userid){//{ oauth_token, oauth_token_secret }) {
    var options = {
        'method': 'GET',
        'hostname': 'api.twitter.com',
        'path': '/2/users/1527522644110753793/tweets?max_results=100&expansions=attachments.media_keys,geo.place_id,author_id&tweet.fields=text,created_at,public_metrics,geo,context_annotations&user.fields=location&media.fields=url,height,width&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type',
        'headers': {
          'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAGctcwEAAAAAAMu1Jmak7O5gCzZm2cHEkVcMSs0%3DwbbsE1kYBde5U0Ut9C9Be4AqPscKHXt0HZimQYmpMB4dC60Udn',
        },
        'maxRedirects': 20
    };
    
    let tweetsMediaData;

    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            let tweetsData = JSON.parse(body);
            console.log(tweetsData);
            console.log(tweetsData.data[0].public_metrics);
            console.log(tweetsData.includes.users);
            tweetsMediaData = tweetsData.includes.media;
            //console.log(tweetsMediaData);
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });
    req.end();

    return tweetsMediaData;
}

function myAccountTwitterController(req, res) {
    if (req.url == "./myAccountTwitter" && oAuthAccessToken == undefined) //call by App
    {
        (async () => {
            try {
                // Get request token
                const oAuthRequestToken = await requestToken();

                authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
                // Get authorization
                authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token);

                const link = authorizeURL.toString();

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(link, 'utf8');
            } catch (e) {
                console.error(e);
            }
        })();
    }
    else if (oAuthAccessToken == undefined) //call by Twitter
    {
        (async () => {
            try {
                // fetch the request token
                const oauth = url.parse(req.url, true).query;
                // Get the access token
                oAuthAccessToken = await accessToken(oauth.oauth_token, oauth.oauth_token_secret, oauth.oauth_verifier);

                console.log(oAuthAccessToken);
                // Make the request
                const tweetsMediaData = await getRequest(oAuthAccessToken.user_id);
                // console.log(response);

                res.writeHead(302, [['location', 'https://twmypictures.herokuapp.com/myAccount'],
                ['Set-Cookie', `oauth_token=${oAuthAccessToken.oauth_token};Max-Age=900.000;SameSite=None;Secure`],
                ['Set-Cookie', `oauth_token_secret=${oAuthAccessToken.oauth_token_secret};Max-Age=900.000;SameSite=None;Secure`],
                ['Set-Cookie', `user_id=${oAuthAccessToken.user_id};Max-Age=900.000;SameSite=None;Secure`],
                ['Set-Cookie', `user_id=${oAuthAccessToken.screen_name};Max-Age=900.000;SameSite=None;Secure`]]);
                res.end();
            } catch (e) {
                console.error(e);
            }
        })();
    }
}

module.exports = {
    myAccountTwitterController
}