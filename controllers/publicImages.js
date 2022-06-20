const imageRepository = require("../models/imageRepository");
const url = require('url');

function publicImagesController(req, res) {
    switch(req.method) {
        case 'GET' :
            publicImages(req, res);
            break;
        default :
            res.writeHead(405);
            res.end();
    }
}

function publicImages(req, res) {
    let query = url.parse(req.url,true).query;
    imageRepository
        .findPublic(query.keyword)
        .then((results) => {
            // console.log(results.rows);
            shuffle(results.rows);
            console.log(results.rows);
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify(results.rows.slice(0, 30)), "utf8");
        })
        .catch((error) => {
            console.log(error);
            res.writeHead(500, {'Content-Type' : 'text/plain'});
            res.end();
        });
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

module.exports = {
    publicImagesController
}