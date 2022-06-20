const { auth } = require("../utils");
async function disconnectTwitterController(req, res) {
    let user = auth(req, res);
    if (!user) {
        console.log("user is not authorized");
        res.writeHead(401, { "Content-Type": "text/html" });
        res.end("Unauthorized", "utf8");
    } else {
        switch(req.method) {
            case "GET" : {
                res.writeHead(303,[
                    ['Set-Cookie', `oauth_token=""; HttpOnly; Max-Age=1; Path=/`],
                    ['Set-Cookie', `oauth_token_secret=""; HttpOnly; Max-Age=1; Path=/`],
                    ['Set-Cookie', `user_id=""; HttpOnly; Max-Age=1; Path=/`],
                    ['Set-Cookie', `user_username=""; HttpOnly; Max-Age=1; Path=/`],
                    ['Location', "https://m-pic.herokuapp.com/myAccount"]
                ]);
                res.end();
                break;
            }
            default : 
                res.writeHead(405);
                res.end();
        }
    }
}

module.exports = {
    disconnectTwitterController
};
