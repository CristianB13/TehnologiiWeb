const url = require("url");
const imageRepository = require("../models/imageRepository");
require("dotenv").config();

function adminImageController(req, res){
    if(/^Bearer .+/.test(req.headers.authorization)){
        let password = req.headers.authorization.substring(7);
        if(password != process.env.ADMIN_PASSWORD) {
            res.writeHead(401, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({"response" : "unathorized"}));
            return;
        }
        switch(req.method){
            case 'GET': {
                    let query = url.parse(req.url,true).query;
                    if(query.id != undefined)
                        getImageById(res, query.id);
                    else
                        getAllImages(res);
                    break;
                }
            case 'DELETE' : {
                let query = url.parse(req.url,true).query;
                if(query.id != undefined)
                    deleteImageById(res, query.id);
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

function getAllImages(res) {
    imageRepository.getAll().then((result) => {
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(result), "utf8");
    }).catch((error) => {
        console.log(error);
        res.writeHead(500);
        res.end();
    })
}

function getImageById(res, id) {
    imageRepository.findById(id).then((result) => {
        console.log(result.length);
        if(result.length == 0){
            res.writeHead(200, {'Content-Type' : 'text/plain'});
            res.end('image not found', 'utf8');

        } else {
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify(result[0]));
        }
    }).catch((error) => {
        console.log(error);
        res.writeHead(500);
        res.end();
    })
}

function deleteImageById(res, id) {
    imageRepository.deleteById(id).then((result) => {
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        if(result.rowCount == 0) {
            res.end("image does not exist", "utf8");
        } else {
            res.end("image deleted successfully");
        }
    }).catch((error) => {
        console.log(error);
        res.writeHead(500);
        res.end();
    });
}

module.exports = {
    adminImageController
}