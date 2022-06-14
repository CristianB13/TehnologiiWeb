const { auth, parseCookies } = require("../utils");
const fetch = require("node-fetch");

async function getRequest(userid){
    let response = await fetch(`https://api.twitter.com/2/users/${userid}/tweets?max_results=100&expansions=attachments.media_keys,geo.place_id,author_id&tweet.fields=text,created_at,public_metrics,geo,context_annotations&user.fields=location&media.fields=url,height,width&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type`, 
    {
        method: "GET",
        headers: {
            "Authorization": 'Bearer AAAAAAAAAAAAAAAAAAAAAGctcwEAAAAAkWEFmNOy7hxJIbmAHOjzCe%2F3iTc%3DCxW76CVcrkkjDpgVQxIAbLWYDNexZd4AIa4bmJH3cwzkFS1LdB'
        }
    });

    let data = await response.json();
    return data;
}

async function myPhotosTwitterController(req, res) {
    let user = auth(req, res);
    if (!user) {
        console.log("user is not authorized for getting photos");
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Unauthorized", "utf8");
    } else {
        let cookies = parseCookies(req);
        if(cookies.user_id != undefined && cookies.user_id != ""){
            let data = await getRequest(cookies.user_id);
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify(data));
        } else {
            res.writeHead(403);
            res.end();
        }
    }
}

module.exports = {
    myPhotosTwitterController
};