const { viewEdit } = require('../views/templates');
const url = require('url');
const mustache = require('mustache');
const { auth } = require('../utils');
const repository = require("../models/repository");

function editController(req, res) {
    if(!auth(req, res)) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        if(req.method === 'GET') {
            let query = url.parse(req.url,true).query;
            repository.findImageBySrc(query.photoSource).then(result => {
                console.log(result);
                if(result.length >= 1) {
                    query.mpicId = result[0].id;
                }
                let view = mustache.render(viewEdit.toString(), query);
                res.end(view, 'utf8');
            }).catch(error => {
                console.log(error);
                res.writeHead(500);
                res.end();
            });
        }
    }
}

module.exports = {
     editController
}