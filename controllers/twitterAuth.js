const { auth } = require("../utils");
const request = require("request");
const util = require("util");
const qs = require("querystring");
const post = util.promisify(request.post);
const consumer_key = "zVG3DnEhWGO3cMOSUCrz5TwxV"; // Add your API key here
const consumer_secret = "JBU7hqvod4VZpAC1kEZT6mHJF4QocOLFJnSoyItyeFf1QmxdI6"; // Add your API secret key here

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
        if (req.method === "GET") {
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
        }
    }
}

module.exports = {
    twitterAuthController,
};
