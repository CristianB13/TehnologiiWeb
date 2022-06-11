const { auth } = require('../utils');
const repository = require("../models/repository");
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
            repository.updateUser("first_name", fname, user.username).then( () => {
                repository.updateUser("last_name", lname, user.username).then( () => {
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