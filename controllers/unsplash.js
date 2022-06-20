const url = require('url');
const { auth } = require('../utils');
const userRepository = require("../models/userRepository");
const fetch = require('node-fetch');

async function unsplashController(req, res) {
    const user = auth(req, res);
    if(!user) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        switch(req.method) {
            case 'GET' :
                unsplash(req, res, user);
                break;
            default :
                res.writeHead(405);
                res.end();
        }
    }
}

async function unsplash(req, res, user) {
    if(req.method === 'GET') {
        let query = url.parse(req.url,true).query;
        let response = await fetch("https://unsplash.com/oauth/token", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                client_id: process.env.UNSPLASH_CLIENT_ID,
                client_secret: process.env.UNSPLASH_CLIENT_SECRET,
                redirect_uri: process.env.UNSPLASH_REDIRECT_URI,
                code: query.code,
                grant_type: process.env.UNSPLASH_GRANT_TYPE
            })
        });
        let data = await response.json();
        console.log("DATA", data.access_token);
        userRepository.updateByUsername("unsplash_token", data.access_token, user.username);
        res.writeHead(303, {
            Location: 'https://m-pic.herokuapp.com/myAccount'
        }).end();
    }
}

module.exports = {
    unsplashController
}