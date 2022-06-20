const userRepository = require("../models/userRepository");
const { auth } = require('../utils');
const url = require('url');
const fetch = require('node-fetch');

async function getUnsplashImageInfoController(req, res) {
    let user = auth(req, res);
    if (!user) {
        console.log("user is not authorized");
        res.writeHead(401, { "Content-Type": "text/html" });
        res.end("Unauthorized", "utf8");
    } else {
        switch(req.method) {
            case "GET" : 
                getUnsplashImageInfo(req, res, user);
                break;
            default : 
                res.writeHead(405);
                res.end();
        }
    }
}

async function getUnsplashImageInfo(req, res, user) {
    userRepository
                .findByUsername(user.username)
                .then(async (databaseUser) => {
                    if (databaseUser.unsplash_token == undefined) {
                        res.writeHead(403);
                        res.end();
                    } else {
                        let query = url.parse(req.url, true).query;
                        let response = await fetch(
                            `https://api.unsplash.com/photos/${query.id}`,
                            {
                                method: "GET",
                                headers: {
                                    "Authorization" : `Bearer ${databaseUser.unsplash_token}`
                                }
                            }
                        );
                        let data = await response.json();
                        res.writeHead(200, {"Content-Type": "application/json"});
                        res.end(JSON.stringify(data), 'utf8');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.writeHead(500);
                    res.end();
                });
}

module.exports = {
    getUnsplashImageInfoController
};
