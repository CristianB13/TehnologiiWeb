const { viewInfo } = require('../views/templates');

function infoController(req, res) {
    switch(req.method) {
        case "GET" :
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.end(viewInfo, 'utf8');
            break;
        default : 
            res.writeHead(405);
            res.end();
    }
}

module.exports = {
    infoController
}