const { auth } = require('../utils');
const userRepository = require("../models/userRepository");
const imageRepository = require("../models/imageRepository");
const crypto = require("crypto");
const FormData = require('form-data');
const fetch = require('node-fetch');
require("dotenv").config();
function deleteAccountController(req, res) {
    let user = auth(req, res);
    if(!user) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        switch(req.method) {
            case "DELETE" : 
                deleteAcount(req, res, user);
                break;
            default : 
                res.writeHead(405);
                res.end();
        }
    }
}

function deleteAcount(req, res, user) {
    userRepository.findByUsername(user.username).then((result) => {
        imageRepository.findByUserId(result.id).then((result) => {
            console.log(result);
            for(let i = 0; i < result.length; i++){
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
            userRepository.deleteByUsername(user.username).then(() => {
                res.writeHead(200, [       
                    ['Set-Cookie', `Token=""; HttpOnly; Max-Age=1`],
                    ['Set-Cookie', `RefreshToken=""; HttpOnly; Max-Age=1`],
                    ['Set-Cookie', `user_id=""; HttpOnly; Max-Age=1; Path=/`],
                    ['Set-Cookie', `user_username=""; HttpOnly; Max-Age=1; Path=/`]
                    ]);
                res.end();
            }).catch(err => {
                console.log(err);
                res.writeHead(500, {
                    'Content-Type' : 'application/json'
                });
                res.end();
            })
        })
    }).catch(error =>{
        console.log(error);
        res.writeHead(500);
        res.end();
    });
}

module.exports = {
    deleteAccountController
}