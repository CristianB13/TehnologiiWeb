const { viewForgotPassword } = require('../views/templates');

function forgotPasswordController(req, res) {
    switch(req.method) {
        case "GET" : 
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.end(viewForgotPassword, 'utf8');
            break;
        default : 
            res.writeHead(405);
            res.end();
    }
}

module.exports = {
    forgotPasswordController
}