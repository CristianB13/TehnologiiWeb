
const { view404 } = require('../views/templates')

function pageNotFound(req, res) {
    switch(req.method) {
        case "GET" : 
            res.writeHead(404, {'Content-Type' : 'text/html'});
            res.end(view404, 'utf8');
            break;
        default : 
            res.writeHead(405);
            res.end();
    }
}

module.exports = {
    pageNotFound
}