const url = require("url");
const userRepository = require("../models/userRepository");
const imageRepository = require("../models/imageRepository");
const crypto = require("crypto");
const FormData = require('form-data');
const fetch = require('node-fetch');
const { getPostData } = require("../utils");
const bcrypt = require("bcrypt");
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
            case 'GET' : {
                    let query = url.parse(req.url,true).query;
                    if(query.id != undefined)
                        getUserById(res, query.id);
                    else
                        getAllUsers(res);
                    break;
                }
            case 'POST' : {
                createUser(req, res);
                break;
            }
            case 'PUT' : {
                let query = url.parse(req.url,true).query;
                if(query.id != undefined)
                    updateUser(req, res, query.id);
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

async function updateUser(req, res, id) {
    const body = await getPostData(req);
    console.log(body);

    let validRequest = true;
    if(body.first_name != undefined && body.first_name == "") validRequest = false;
    else if(body.last_name != undefined && body.last_name == "") validRequest = false;
    else if(body.password != undefined && validatePassword(body.password) == false) validRequest = false;
    else if(body.first_name == undefined && body.last_name == undefined && body.password == undefined) validRequest = false;

    if(validRequest == false) {
        res.writeHead(400, {'Content-Type' : 'text/plain'});
        res.end('invalid arguments');
        return;
    }

    userRepository.findById(id).then(async () => {
        if(body.first_name != undefined ){
            userRepository.updateById("first_name", body.first_name, id).then((result) => {
                console.log(result);
            }).
            catch((error) => {
                console.log(error);
                res.writeHead(500);
                res.end();
                return;
            });
        }
        if(body.last_name != undefined) {
            userRepository.updateById("last_name", body.last_name, id).
            catch((error) => {
                console.log(error);
                res.writeHead(500);
                res.end();
                return;
            });
        }
        if(body.password != undefined) {
            let saltRounds = 10;
            let password = await bcrypt.hash(body.password, saltRounds);
            userRepository.updateById("password", password, id).catch((error) => {
                console.log(error);
                res.writeHead(500);
                res.end();
                return;
            });
        }
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end('user updated successfully');
    }).catch((error) => {
        res.writeHead(404, {'Content-Type' : 'text/plain'});
        res.end('user not found', 'utf8');
    });
}

async function createUser(req, res) {
    const body = await getPostData(req);
    let validRequest = true;
    if(body.firstName == undefined || body.first_name == "") validRequest = false;
    else if(body.lastName == undefined || body.last_name == "") validRequest = false;
    else if(body.password == undefined || validatePassword(body.password) == false) validRequest = false;
    else if(body.email == undefined || validateEmail(body.email) == false) validRequest = false;
    else if(body.username == undefined || validateUsername(body.username) == false) validRequest = false;

    if(validRequest == false) {
        res.writeHead(400, {'Content-Type' : 'text/plain'});
        res.end('invalid arguments');
        return;
    }
    const { firstName, lastName, email, username, password } = body;
    const user = {
        firstName,
        lastName,
        email,
        username,
        password,
    };
    console.log(user);
    let saltRounds = 10;
    user.password = await bcrypt.hash(password, saltRounds);
    userRepository.create(user)
        .then(() => {
            res.writeHead(201, { "Content-Type": "text/plain" });
            res.end("user created successfully");
        })
        .catch(() => {
            res.writeHead(409, {"Content-Type" : "text/plain"});
            res.end("user couldn't be created");
        });
}

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
        password
    );
}

function validateEmail(mail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}

function validateUsername(username) {
    return /^\w{3,25}$/.test(username);
}


module.exports = {
    adminUserController
}