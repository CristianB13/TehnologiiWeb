const { viewMyAccount } = require("../views/templates");
const { getPostData } = require("../utils");
const repository = require("../models/repository");
const bcrypt = require("bcrypt");
const mime = require('mime');
const jwt = require('jsonwebtoken');
async function loginUserController(req, res) {
    try {
        const body = await getPostData(req);
        const { username, password } = body;
        const user = {
            username,
            password,
        };

        repository
            .findByUsername(user.username)
            .then((userData) => {
                bcrypt
                    .compare(user.password, userData.password)
                    .then(function(result){
                        const token = jwt.sign({"username": userData.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2m'});
                        const refreshToken = jwt.sign({"username": userData.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '6h'});
                        // repository.updateUser("refresh_token", refreshToken);
                        console.log("Token: ", token);
                        console.log("RefreshToken", refreshToken);

                        if(result){
                            res.writeHead(200, [['Content-Type', 'text/html'],
                                                ['Set-Cookie', `Token=${token}; HttpOnly; Max-Age=2147483647;SameSite=None;Secure`],
                                                ['Set-Cookie', `RefreshToken=${refreshToken}; HttpOnly; Max-Age=2147483647;SameSite=None;Secure`]]);
                            res.end('success');
                        }
                        else {
                            // console.log('login denied');
                            res.writeHead(401, {'Content-Type' : mime.getType(".txt")});
                            res.end('incorrect password');
                        }
                    })
                    .catch((error) => {
                        // console.log(error);
                        res.writeHead(401, {'Content-Type' : mime.getType(".txt")});
                        res.end("server error");
                    });
            })
            .catch((err) => {
                console.log(err);
                res.writeHead(401, {'Content-Type' : mime.getType(".txt")});
                res.end("user doesn't exist");
            });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loginUserController,
};
