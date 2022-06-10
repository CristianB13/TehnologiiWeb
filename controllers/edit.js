const { viewEdit } = require('../views/templates');
const url = require('url');
const mustache = require('mustache');
const { auth } = require('../utils');

function editController(req, res) {
    if(!auth(req, res)) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        if(req.method === 'GET') {
            let query = url.parse(req.url,true).query;
            let view = mustache.render(viewEdit.toString(), query);
            res.end(view, 'utf8');
        }
    }
}

module.exports = {
     editController
}