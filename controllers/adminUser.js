const url = require("url");
const userRepository = require("../models/userRepository");
const imageRepository = require("../models/imageRepository");
const crypto = require("crypto");
const FormData = require('form-data');
const fetch = require('node-fetch');
require("dotenv").config();

function adminUserController(req, res){
    // console.log(req.headers.authorization);
    if(/^Bearer .+/.test(req.headers.authorization)){
        let password = req.headers.authorization.substring(7);
        if(password != process.env.ADMIN_PASSWORD) {
            res.writeHead(401, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({"response" : "unathorized"}));
            return;
        }
        switch(req.method){
            case 'GET': {
                    let query = url.parse(req.url,true).query;
                    if(query.id != undefined)
                        getUserById(res, query.id);
                    else
                        getAllUsers(res);
                    break;
                }
            case 'DELETE' : {
                let query = url.parse(req.url,true).query;
                if(query.id != undefined)
                    deleteUserById(res, query.id);
                else {
                    res.writeHead(405);
                    res.end();
                }
                break;
            }
            default :
                res.writeHead(405);
                res.end();
        }        
    } else {
        res.writeHead(401, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify({"response" : "unathorized"}));
    }
}

function getUserById(res, id) {
    userRepository.findById(id).then((result) => {
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(result));
    }).catch((error) => {
        console.log(error);
        res.writeHead(404, {'Content-Type' : 'text/plain'});
        res.end(error, "utf8");
    })
}

function getAllUsers(res) {
    userRepository.getAll().then((result) => {
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(result));
    }).catch((error) => {
        console.log(error);
        res.writeHead(500);
        res.end();
    })
}

function deleteUserById(res, id) {
    console.log("ID", id);
    imageRepository.findByUserId(id).then((result) => {
        console.log(result);
        for(let i = 0; i < result.length; i++) {
            let timestamp = Math.floor(Date.now()/1000);
            let public_id = result[i].public_id;
            let signature = crypto.createHash('sha1').update(`public_id=${public_id}&timestamp=${timestamp}${process.env.CLOUD_API_SECRET}`).digest('hex');
            let formData = new FormData();
            formData.append("signature", signature);
            formData.append("public_id", public_id);
            formData.append("api_key", process.env.CLOUD_API_KEY);
            formData.append("timestamp", timestamp);
            fetch('https://api.cloudinary.com/v1_1/m-pic/image/destroy', {
                method : 'POST',
                headers: {
                    'Accept' : 'application/json'
                },
                body : formData
            }).then(async (cloudResponse) => {
                cloudResponse = await cloudResponse.json();
                console.log("Delete response: ", cloudResponse);
            }).catch(error => {
                console.log(error);
                res.writeHead(500);
                res.end();
            });
        }
    });
    userRepository.deleteById(id).then((result) => {
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        if(result.rowCount == 0) {
            res.end("user does not exist", "utf8");
        } else {
            res.end("user deleted successfully");
        }
    }).catch(err => {
        console.log(err);
        res.writeHead(500, {
            'Content-Type' : 'application/json'
        });
        res.end();
    });
}

module.exports = {
    adminUserController
}