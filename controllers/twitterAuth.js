const { auth } = require("../utils");
const request = require("request");
const util = require("util");
const qs = require("querystring");
const post = util.promisify(request.post);
require("dotenv").config();
const consumer_key = process.env.TWITTER_CONSUMER_KEY; // Add your API key here
const consumer_secret = process.env.TWITTER_CONSUMER_SECRET; // Add your API secret key here

let requestTokenURL; //= new URL('https://api.twitter.com/oauth/request_token'); //step 1
let authorizeURL; //= new URL('https://api.twitter.com/oauth/authorize'); //step 2

async function requestToken() {
    const oAuthConfig = {
        callback: "https://m-pic.herokuapp.com/myAccountTwitter",
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
    };

    requestTokenURL = new URL("https://api.twitter.com/oauth/request_token");
    const req = await post({ url: requestTokenURL, oauth: oAuthConfig });

    if (qs.parse(req.body).oauth_callback_confirmed) {
        return qs.parse(req.body);
    } else {
        throw new console.error("Cannot get an OAuth request token");
    }
}

async function twitterAuthController(req, res) {
    const user = auth(req, res);
    if (!user) {
        console.log("user is not authorized");
        res.writeHead(401, { "Content-Type": "text/html" });
        res.end("Unauthorized", "utf8");
    } else {
        switch(req.method) {
            case 'GET' : {
                (async () => {
                    try {
                        // Get request token
                        const oAuthRequestToken = await requestToken();
                        authorizeURL = new URL(
                            "https://api.twitter.com/oauth/authorize"
                        );
                        // Get authorization
                        authorizeURL.searchParams.append(
                            "oauth_token",
                            oAuthRequestToken.oauth_token
                        );
                        const link = authorizeURL.toString();
                        res.writeHead(303, {
                            Location: link,
                        }).end();
                    } catch (e) {
                        console.error(e);
                    }
                })();
                break;
            }
            default :
                res.writeHead(405);
                res.end();
        }
    }
}

module.exports = {
    twitterAuthController,
};
