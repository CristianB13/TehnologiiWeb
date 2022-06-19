const repository = require("../models/repository");
const url = require('url');

function publicImagesController(req, res) {
    if (req.method == "GET") {
        let query = url.parse(req.url,true).query;
        repository
            .findPublicImages(query.keyword)
            .then((results) => {
                // console.log(results.rows);
                shuffle(results.rows);
                console.log(results.rows);
                res.writeHead(200, {'Content-Type' : 'application/json'});
                res.end(JSON.stringify(results.rows), "utf8");
            })
            .catch((error) => {
                console.log(error);
                res.writeHead(500, {'Content-Type' : 'text/plain'});
                res.end();
            });
    }
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