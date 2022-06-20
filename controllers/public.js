const fs = require("fs");
const path = require("path");
const { view404 } = require("../views/templates");
const mime = require('mime')
function publicController(req, res) {
    switch(req.method) {
        case 'GET' : {
            fs.readFile(path.join(req.url), (err, content) => {
                if (err) {
                    console.log(req.url);
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(view404, "utf8");
                } else {
                    let contentType = mime.getType(req.url);
                    res.writeHead(200, {
                        "Content-Type": contentType,
                        "Cache-Control": "max-age=0",
                    });
                    res.end(content, "utf8");
                }
            });
            break;
        }
        default :
            res.writeHead(405);
            res.end();
    }

}

module.exports = {
    publicController,
};
