const {auth} = require('../utils');
function logoutController(req, res){
    switch(req.method) {
        case 'GET' :
            logout(req, res);
            break;
        default : 
            res.writeHead(405);
            res.end();
    }

}

function logout(req, res) {
    let user = auth(req, res);
    if (!user) {
        console.log("user is not authorized");
        res.writeHead(401, { "Content-Type": "text/html" });
        res.end("Unauthorized", "utf8");
    } else {
        res.writeHead(303, [        
        ['Set-Cookie', `Token=""; HttpOnly; Max-Age=1`],
        ['Set-Cookie', `RefreshToken=""; HttpOnly; Max-Age=1`],
        ['Set-Cookie', `user_id=""; HttpOnly; Max-Age=1; Path=/`],
        ['Set-Cookie', `user_username=""; HttpOnly; Max-Age=1; Path=/`],
        ['Location', 'https://m-pic.herokuapp.com/']]).end();
    }
}
module.exports = {
    logoutController
}