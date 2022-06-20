const { viewLogin } = require('../views/templates');

function loginController(req, res) {
    switch(req.method) {
        case "GET" : 
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.end(viewLogin, 'utf8');
            break;
        default :
            res.writeHead(405);
            res.end();
    }
}

module.exports = {
    loginController
}