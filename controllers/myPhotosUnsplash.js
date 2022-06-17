const { auth } = require("../utils");
const fetch = require("node-fetch");
const repository = require("../models/repository");
async function myPhotosUnsplashController(req, res) {
    let user = auth(req, res);
    if (!user) {
        console.log("user is not authorized for getting photos");
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Unauthorized", "utf8");
    } else {
        repository
            .findByUsername(user.username)
            .then(async (newUser) => {
                if (!newUser.unsplash_token) {
                    res.writeHead(401, { "Content-Type": "text/plain" });
                    res.end("unsplash token doesn't exist", "utf8");
                } else {
                    try {
                        let response = await fetch(
                            `https://api.unsplash.com/me`,
                            {
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${newUser.unsplash_token}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        if(response.status === 401) {
                            repository.updateUser("unsplash_token", null, newUser.username);
                            res.writeHead(401, {'Content-Type' : 'plain/text'});
                            res.end("you are not connected to unsplash", "utf8");
                            return;
                        }

                        let myUser = await response.json();

                        console.log("UNSPLASH", myUser);
                        
                        let photos = await fetch(
                            `https://api.unsplash.com/users/${myUser.username}/photos`,
                            {
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${newUser.unsplash_token}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        photos = await photos.json();
                        res.writeHead(200, {
                            "Content-Type": "application/json",
                        });
                        res.end(JSON.stringify(photos), "utf8");
                    } catch (err) {
                        res.writeHead(500);
                        res.end();
                    }
                }
            })
            .catch((err) => console.log(err));
    }
}

module.exports = {
    myPhotosUnsplashController,
};
