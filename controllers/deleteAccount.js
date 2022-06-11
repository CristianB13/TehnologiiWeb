const { auth } = require('../utils');
const repository = require("../models/repository");
function deleteAccountController(req, res) {
    let user = auth(req, res);
    if(!user) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        if(req.method == 'DELETE'){
            repository.deleteByUsername(user.username).then(() => {
                res.writeHead(200, [       
                    ['Set-Cookie', `Token=""; HttpOnly; Max-Age=1`],
                    ['Set-Cookie', `RefreshToken=""; HttpOnly; Max-Age=1`]
                    ]);
                res.end();
            }).catch(err => {
                console.log(err);
                res.writeHead(500, {
                    'Content-Type' : 'application/json'
                });
                res.end();
            })
        }
    }
}

module.exports = {
    deleteAccountController
}