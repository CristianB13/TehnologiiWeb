const { viewContact } = require('../views/templates');

function contactController(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(viewContact, 'utf8');
}

module.exports = {
    contactController
}