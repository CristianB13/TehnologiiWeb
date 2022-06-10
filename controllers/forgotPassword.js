const { viewForgotPassword } = require('../views/templates');

function forgotPasswordController(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(viewForgotPassword, 'utf8');
}

module.exports = {
    forgotPasswordController
}