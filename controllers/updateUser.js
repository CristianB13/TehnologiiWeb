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
        if(req.method == 'PUT'){
            const body = await getPostData(req);
            const { fname, lname } = body;
            userRepository.update("first_name", fname, user.username).then( () => {
                userRepository.update("last_name", lname, user.username).then( () => {
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
    }
}

module.exports = {
    updateUserController
}