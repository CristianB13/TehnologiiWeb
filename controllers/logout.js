const {auth} = require('../utils');
function logoutController(req, res){
    let user = auth(req, res);
    if (!user) {
        console.log("user is not authorized");
        res.writeHead(401, { "Content-Type": "text/html" });
        res.end("Unauthorized", "utf8");
    } else {
        res.writeHead(303, [        
        ['Set-Cookie', `Token=""; HttpOnly; Max-Age=1`],
        ['Set-Cookie', `RefreshToken=""; HttpOnly; Max-Age=1`],
        ['Location', 'https://m-pic.herokuapp.com/']]).end();
    }
}

module.exports = {
    logoutController
}