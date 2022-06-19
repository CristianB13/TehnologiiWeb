const { auth } = require('../utils');
const repository = require("../models/repository");
const { getPostData } = require("../utils");
const url = require('url');
const uuid = require('uuid');
const crypto = require("crypto");
const FormData = require('form-data');
const fetch = require('node-fetch');
require("dotenv").config();


async function imageController(req, res){
    let user = auth(req, res);
    if(!user) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        if(req.method == 'GET'){
            let query = url.parse(req.url,true).query;
            if(query.id != undefined)
                getImageById(res, query.id);
            else
                getImages(res, user);
        } else if(req.method == 'POST') {
            postImage(req, res, user);
        } else if (req.method == 'PUT') {
            putImage(req, res, user);
        } else if(req.method == 'DELETE') {
            deleteImage(req, res, user);
        }
    }
}

function getImageById(res, id) {
    repository.findImageById(id).then((result) => {
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(result[0]), 'utf8');
    }).catch(error => {
        console.log(error);
        res.writeHead(500);
        res.end();
    })     
}

function getImages(res, user) {
    repository.findByUsername(user.username).then((myUser) => {
        repository.getUserImages(myUser.id).then((photos) => {
            // console.log(photos);
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify(photos));
        }).catch((error) => {
            console.log(error);
            res.writeHead(500);
            res.end();
        })     
    }).catch(error => {
        console.log(error);
        res.writeHead(500);
        res.end();
    })     
}

async function postImage(req, res, user) {
    const body = await getPostData(req);
    const { src, description } = body;
    repository.findByUsername(user.username).then((myUser) => {
        let timestamp = Math.floor(Date.now()/1000);
        let public_id = `m-pic/${uuid.v1()}`;
        let signature = crypto.createHash('sha1').update(`invalidate=true&overwrite=true&public_id=${public_id}&timestamp=${timestamp}${process.env.CLOUD_API_SECRET}`).digest('hex');
        console.log(signature);
        let formData = new FormData();
        formData.append("file", src);
        formData.append("signature", signature);
        formData.append("public_id", public_id);
        formData.append("api_key", process.env.CLOUD_API_KEY);
        formData.append("timestamp", timestamp);
        formData.append("overwrite", "true");
        formData.append("invalidate", "true");
        fetch('https://api.cloudinary.com/v1_1/m-pic/image/upload', {
            method : 'POST',
            headers: {
                'Accept' : 'application/json'
            },
            body : formData
        }).then(async (cloudResponse) => {
            cloudResponse = await cloudResponse.json();
            console.log("Create response: ", cloudResponse);
            repository.createImage({"user_id" : myUser.id, "src" : cloudResponse.secure_url, "public_id" : cloudResponse.public_id, "exif_data" : null, "description" : description}).then((result) => {
                console.log(result);
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
    }).catch(error => {
        console.log(error);
        res.writeHead(500);
        res.end();
    })
}

async function putImage(req, res, user){
    const body = await getPostData(req);
    const { id, src, access } = body;
    console.log("ID",id);
    console.log("SRC",src);
    console.log("ACCESS",access);
    repository.findImageById(id).then(async result => {
        if(result.length == 0) {
            res.writeHead(404);
            res.end();
        } else if(result.length > 0){
            let myUser = await repository.findByUsername(user.username);
            if(myUser.id !== result[0].user_id){
                res.writeHead(403);
                res.end();
                return;
            }
            let responseObject = {};
            if(src != undefined) {
                let timestamp = Math.floor(Date.now()/1000);
                let public_id = result[0].public_id;
                let signature = crypto.createHash('sha1').update(`invalidate=true&overwrite=true&public_id=${public_id}&timestamp=${timestamp}${process.env.CLOUD_API_SECRET}`).digest('hex');
                let formData = new FormData();
                formData.append("file", src);
                formData.append("signature", signature);
                formData.append("public_id", public_id);
                formData.append("api_key", process.env.CLOUD_API_KEY);
                formData.append("timestamp", timestamp);
                formData.append("overwrite", "true");
                formData.append("invalidate", "true");
                fetch('https://api.cloudinary.com/v1_1/m-pic/image/upload', {
                    method : 'POST',
                    headers: {
                        'Accept' : 'application/json'
                    },
                    body : formData
                }).then(async (cloudResponse) => {
                    cloudResponse = await cloudResponse.json();
                    console.log("Update response: ", cloudResponse);
                    repository.updateImage("src", cloudResponse.secure_url, id).then(result => {
                            console.log(result);
                            responseObject.src = cloudResponse.url;
                            res.writeHead(200, {'Content-Type' : 'application/json'});
                            res.end(JSON.stringify(responseObject), "utf8");
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
            }
            if(access != undefined) {
                repository.updateImage("access", access, id).then((result) => {
                    console.log(result);
                    responseObject.access = access;
                    res.writeHead(200, {'Content-Type' : 'application/json'});
                    res.end(JSON.stringify(responseObject), "utf8");
                }).catch((error) => {
                    console.log(error);
                    res.writeHead(500);
                    res.end();
                })
            }

        }
    }).catch(error => {
        console.log(error);
    })
}

async function deleteImage(req, res, user){
    const body = await getPostData(req);
    const { id } = body;
    repository.findImageById(id).then(async result => {
        if(result.length == 0){
            res.writeHead(404);
            res.end();
        } else if(result.length > 0){
            let myUser = await repository.findByUsername(user.username);
            if(myUser.id !== result[0].user_id){
                res.writeHead(403);
                res.end();
                return;
            }
            let timestamp = Math.floor(Date.now()/1000);
            let public_id = result[0].public_id;
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
                repository.deleteImageById(id).then(result => {
                    console.log(result);
                    res.writeHead(200);
                    res.end();
                }).catch(error => {
                    console.log(error);
                    res.writeHead(500);
                    res.end();
                });
            }).catch(error => {
                console.log(error);
                res.writeHead(500);
                res.end();
            });
        }
    }).catch(error => {
        console.log(error);
        res.writeHead(500);
        res.end();
    })
}

module.exports = {
    imageController
}