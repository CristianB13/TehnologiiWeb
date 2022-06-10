const { viewExplore } = require('../views/templates');
const { auth } = require('../utils');

function exploreController(req, res) {
    if(!auth(req, res)) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        // res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(viewExplore, 'utf8');
    }
}

module.exports = {
     exploreController
}