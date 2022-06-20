const { auth } = require('../utils');
const userRepository = require("../models/userRepository");

function meController(req, res) {
    let user = auth(req, res);
    if(!user) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        switch(req.method) {
            case 'GET' :
                me(res, user);
                break;
            default :
                res.writeHead(405);
                res.end();
        }
    }
}

function me(res, user) {
    userRepository.findByUsername(user.username).then((myUser) => {
        let responseUser = {
            "first_name" : myUser.first_name,
            "last_name" : myUser.last_name
        };
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(responseUser), 'utf8');
    }).catch(err => {
        console.log(err);
        res.writeHead(500);
        res.end();
    })
}

module.exports = {
    meController
}