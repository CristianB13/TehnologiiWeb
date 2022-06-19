const http = require("http");
const url = require("url");
const controllers = require("./controllers");
require("dotenv").config();

let pathRegex = /^\.\/public\/.+/;
const server = http.createServer((req, res) => {
    req.url = `.${req.url}`;
    console.log(url.parse(req.url, true).pathname);
    if (pathRegex.test(req.url)) {
        controllers.publicController(req, res);
    } else {
        switch (url.parse(req.url, true).pathname) {
            case './admin/users':
                controllers.adminUserController(req, res);
                break;
            case './admin/images':
                controllers.adminImageController(req, res);
                break;
            case "./":
                controllers.loginController(req, res);
                break;
            case "./favicon.ico":
                req.url = "./public/images/logo2.ico";
                controllers.publicController(req, res);
                break;
            case "./login":
                controllers.loginController(req, res);
                break;
            case "./register":
                controllers.registerController(req, res);
                break;
            case "./contact":
                controllers.contactController(req, res);
                break;
            case "./edit":
                controllers.editController(req, res);
                break;
            case "./explore":
                controllers.exploreController(req, res);
                break;
            // case "./forgotPassword":
            //     controllers.forgotPasswordController(req, res);
            //     break;
            case "./info":
                controllers.infoController(req, res);
                break;
            case "./myAccount":
                controllers.myAccountController(req, res);
                break;
            case "./registerUser":
                controllers.registerUserController(req, res);
                break;
            case "./loginUser":
                controllers.loginUserController(req, res);
                break;
            case "./unsplash":
                controllers.unsplashController(req, res);
                break;
            case "./myPhotos/unsplash":
                controllers.myPhotosUnsplashController(req, res);
                break;
            case "./myPhotos/twitter":
                controllers.myPhotosTwitterController(req, res);
                break;
            case "./disconnect/unsplash":
                controllers.disconnectUnsplashController(req, res);
                break;
            case "./disconnect/twitter":
                controllers.disconnectTwitterController(req, res);
                break;
            case "./logout":
                controllers.logoutController(req, res);
                break;
            case "./unsplash/photos":
                controllers.getUnsplashImageInfoController(req, res);
                break;
            case "./me":
                controllers.meController(req, res);
                break;
            case "./updateUser":
                controllers.updateUserController(req, res);
                break;
            case "./deleteAccount":
                controllers.deleteAccountController(req, res);
                break;
            case "./image" :
                controllers.imageController(req, res);
                break;
            case "./upload":
                controllers.uploadController(req, res);
                break;
            case "./twitterAuth":
                controllers.twitterAuthController(req, res);
                break;
            case "./myAccountTwitter" :
                controllers.myAccountTwitterController(req, res);
                break;
            case "./postTweet":
                controllers.postTweetController(req, res);
                break;
            case "./mpic/random":
                controllers.publicImagesController(req, res);
                break;
            case "./twitter/random":
                controllers.getRandomImagesTwitterController(req, res);
                break;
            default:
                controllers.pageNotFound(req, res);
        }
    }
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT} ..`);
});
