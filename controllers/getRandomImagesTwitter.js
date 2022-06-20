const fetch = require('node-fetch');
const url = require('url');
require("dotenv").config();

async function getRandomImagesTwitterController(req, res) {
    switch(req.method) {
        case "GET" : 
            getRandomImagesTwitter(req, res);
            break;
        default : 
            res.writeHead(405);
            res.end();
    }
}

async function getRandomImagesTwitter(req, res) {
    let query = url.parse(req.url,true).query;
    fetch(`https://api.twitter.com/2/tweets/search/recent?query=${query.keyword}&max_results=30&expansions=attachments.media_keys,geo.place_id,author_id&tweet.fields=text,created_at,public_metrics,geo,context_annotations&user.fields=location,profile_image_url&media.fields=url,height,width&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type`, {
        method : 'GET',
        headers : {
            'Authorization' : `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
    }).then(async (response) => {
        response = await response.json();
        // console.log(response);
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(response), "utf8");

    }).catch(error => {
        console.log(error);
        res.writeHead(500);
        res.end();
    })
}

module.exports = {
    getRandomImagesTwitterController
}