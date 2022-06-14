const { auth } = require('../utils');
const repository = require("../models/repository");
const { getPostData } = require("../utils");

async function imageController(req, res){
    let user = auth(req, res);
    if(!user) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        if(req.method == 'POST') {
            const body = await getPostData(req);
            const { src } = body;
            repository.findByUsername(user.username).then((myUser) => {
                repository.createImage({"user_id" : myUser.id, "src" : src}).then((result) => {
                    // console.log(result);
                    res.writeHead(201);
                    res.end();
                }).catch(error => {
                    console.log(error);
                    res.writeHead(500);
                    res.end();
                })
            }).catch(error => {
                console.log(error);
                res.writeHead(500);
                res.end();
            })
        } else if (req.method == 'PUT') {

        }
    }
}

module.exports = {
    imageController
}