const { viewRegister } = require('../views/templates');

function registerController(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(viewRegister, 'utf8');
}

module.exports = {
    registerController
}