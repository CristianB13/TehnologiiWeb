const { viewContact } = require('../views/templates');

function contactController(req, res) {
    switch(req.method) {
        case "GET" : 
            res.writeHead(200, {'Content-Type' : 'text/html'});   
            res.end(viewContact, 'utf8');
            break;
        default : 
            res.writeHead(405);
            res.end();
    }
}

module.exports = {
    contactController
}