
const { view404 } = require('../views/templates')

function pageNotFound(req, res) {
    res.writeHead(404, {'Content-Type' : 'text/html'});
    res.end(view404, 'utf8');
}

module.exports = {
    pageNotFound
}