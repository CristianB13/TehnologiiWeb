const userRepository = require("../models/userRepository");
const { getPostData } = require("../utils");
const { auth } = require("../utils");
async function disconnectUnsplashController(req, res) {
    let user = auth(req, res);
    if (!user) {
        console.log("user is not authorized");
        res.writeHead(401, { "Content-Type": "text/html" });
        res.end("Unauthorized", "utf8");
    } else {
        switch(req.method) {
            case "PUT" : 
                disconnectUnsplash(req, res, user);
                break;
            default : 
                res.writeHead(405);
                res.end();
        }
    }
}

async function disconnectUnsplash(req, res, user) {
    const body = await getPostData(req);
    const { platform } = body;
    userRepository
        .updateByUsername(`${platform}_token`, null, user.username)
        .then(() => {
            res.writeHead(200);
            res.end();
        })
        .catch(() => {
            res.writeHead(500);
            res.end();
        });
}

module.exports = {
    disconnectUnsplashController
};
