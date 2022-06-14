const { auth } = require('../utils');
const repository = require("../models/repository");
const { getPostData } = require("../utils");
const cloudinary = require('cloudinary');
const uuid = require('uuid');
require("dotenv").config();
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

async function imageController(req, res){
    let user = auth(req, res);
    if(!user) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        if(req.method == 'GET'){
            getImage(res, user);
        } else if(req.method == 'POST') {
            postImage(req, res, user);
        } else if (req.method == 'PUT') {
            putImage(req, res, user);
        } else if(req.method == 'DELETE') {
            deleteImage(req, res, user);
        }
    }
}

function getImage(res, user) {
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
    const { src } = body;
    repository.findByUsername(user.username).then((myUser) => {
        cloudinary.v2.uploader.upload(src, {
            resource_type: "image",
            overwrite: true,
            invalidate: true,
            public_id: `m-pic/${uuid.v1()}`
        }, (cloudError, cloudResponse) => {
            if(cloudError == undefined){
                console.log("Response: ", cloudResponse);
                repository.createImage({"user_id" : myUser.id, "src" : cloudResponse.url, "public_id" : cloudResponse.public_id}).then((result) => {
                    // console.log(result);
                    res.writeHead(201);
                    res.end();
                }).catch(error => {
                    console.log(error);
                    res.writeHead(500);
                    res.end();
                })
            } else {
                console.log(cloudError);
                res.writeHead(500);
                res.end();
            }
        })
    }).catch(error => {
        console.log(error);
        res.writeHead(500);
        res.end();
    })
}

async function putImage(req, res, user){
    const body = await getPostData(req);
    const { id, src } = body;
    repository.findImageById(id).then(result => {
        if(result.length > 0){
            cloudinary.v2.uploader.upload(src, {
                resource_type: "image",
                overwrite: true,
                invalidate: true,
                public_id: result[0].public_id
            }, (cloudError, cloudResponse) => {
                if(cloudError == undefined){
                    console.log("Response: ", cloudResponse);
                    repository.updateImage("src", cloudResponse.url, id).then(result => {
                        console.log(result);
                        res.writeHead(200, {'Content-Type' : 'application/json'});
                        res.end(JSON.stringify({"src" : cloudResponse.url}));
                    }).catch(error => {
                        console.log(error);
                        res.writeHead(500);
                        res.end();
                    })
                } else {
                    console.log(cloudError);
                    res.writeHead(500);
                    res.end();
                }
            })
        }
    }).catch(error => {
        console.log(error);
    })
}

async function deleteImage(req, res, user){
    const body = await getPostData(req);
    const { id } = body;
    repository.findImageById(id).then(result => {
        if(result.length > 0){
            cloudinary.v2.uploader.destroy(result[0].public_id, { resource_type: "image" }
            ,(cloudError, cloudResponse) => {
                if(cloudError == undefined){
                    console.log("Response: ", cloudResponse);
                    repository.deleteImageById(id).then(result => {
                        console.log(result);
                        res.writeHead(200);
                        res.end();
                    })
                } else {
                    console.log(cloudError);
                    res.writeHead(500);
                    res.end();
                }
            })
        }
    }).catch(error => {
        console.log(error);
    })
}
module.exports = {
    imageController
}