const { viewInfo } = require('../views/templates');

function infoController(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(viewInfo, 'utf8');
}

module.exports = {
    infoController
}