const { auth } = require("../utils");
const repository = require("../models/repository");
function myPhotosMpicController(req, res) {
    let user = auth(req, res);
    if (!user) {
        console.log("user is not authorized for getting photos");
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Unauthorized", "utf8");
    } else {
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
}

module.exports = {
    myPhotosMpicController,
};
