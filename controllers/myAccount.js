const { viewMyAccount } = require('../views/templates');
const { auth } = require('../utils');
const mustache = require('mustache');
const repository = require('../models/repository');

async function myAccountController(req, res) {
    let user = auth(req, res);
    if(!user) {
        console.log("user is not authorized");
        res.writeHead(401, {'Content-Type' : 'text/html'});
        res.end("Unauthorized", 'utf8');
    } else {
        let myUser = await repository.findByUsername(user.username);
        let data = {};
        data.unsplash = {};
        data.unsplash.connected = "hidden";
        data.unsplash.disconnected = "";
        if(myUser.unsplash_token == undefined) {
            [data.unsplash.connected, data.unsplash.disconnected] = [data.unsplash.disconnected, data.unsplash.connected];
        }

        let view = mustache.render(viewMyAccount.toString(), data);
        res.end(view, 'utf8');
    }
}

module.exports = {
    myAccountController
}