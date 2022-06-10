const { viewLogin } = require('../views/templates');

function loginController(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(viewLogin, 'utf8');
}

module.exports = {
    loginController
}