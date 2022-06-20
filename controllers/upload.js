const formidable = require('formidable');
const { auth } = require('../utils');
const userRepository = require("../models/userRepository");
const imageRepository = require("../models/imageRepository");
const uuid = require('uuid');
const crypto = require("crypto");
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
require("dotenv").config();

function uploadController(req, res){
    let user = auth(req, res);
    if(!user) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        switch(req.method) {
            case 'POST' :
                upload(req, res, user);
                break;
            default : 
                res.writeHead(405);
                res.end();
        }
    }
}

function upload( req, res, user) {
    const form = formidable({multiples: true});
    form.parse(req, (error, fields, files) => {
        // console.log("Fields:" , JSON.parse(fields.exif));
        if(error){
            console.log(error);
            res.writeHead(400);
            res.end();
        } else {
            userRepository.findByUsername(user.username).then((myUser) => {
                let timestamp = Math.floor(Date.now()/1000);
                let public_id = `m-pic/${uuid.v1()}`;
                let signature = crypto.createHash('sha1').update(`invalidate=true&overwrite=true&public_id=${public_id}&timestamp=${timestamp}${process.env.CLOUD_API_SECRET}`).digest('hex');
                console.log(signature);
                let formData = new FormData();
                formData.append("file", fs.createReadStream(files.image.filepath));
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
                    imageRepository.create({"user_id" : myUser.id, "src" : cloudResponse.secure_url, "public_id" : cloudResponse.public_id, "exif_data" : fields.exif, "description" : fields.description}).then((result) => {
                        console.log(result);
                        res.writeHead(201, {'Content-Type' : 'application/json'});
                        res.end(JSON.stringify(files.image));
                    }).catch(error => {
                        console.log(error);
                        res.writeHead(500);
                        res.end();
                    });
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
    })
}
module.exports = {
    uploadController
}