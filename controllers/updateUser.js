const { auth } = require('../utils');
const userRepository = require("../models/userRepository");
const { getPostData } = require("../utils");

async function updateUserController(req, res){
    let user = auth(req, res);
    if(!user) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        switch(req.method) {
            case 'PUT' :
                updateUser(req, res, user);
                break;
            default :
                res.writeHead(405);
                res.end();
        }
    }
}

async function updateUser(req, res, user) {
    const body = await getPostData(req);
    const { fname, lname } = body;
    userRepository.updateByUsername("first_name", fname, user.username).then( () => {
        userRepository.updateByUsername("last_name", lname, user.username).then( () => {
            res.writeHead(200, {'Content-Type' : 'text/plain'});
            res.end("succes");
        }
        ).catch(err => {
            console.log(err);
            res.writeHead(500, {'Content-Type' : 'text/plain'});
            res.end("fail");
        });
    }
    ).catch(err => {
        console.log(err);
        res.writeHead(500, {'Content-Type' : 'text/plain'});
        res.end('fail');
    });
}
module.exports = {
    updateUserController
}