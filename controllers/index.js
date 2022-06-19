const { loginController } = require("./login");
const { contactController } = require("./contact");
const { exploreController } = require("./explore");
// const { forgotPasswordController } = require("./forgotPassword");
const { infoController } = require("./info");
const { myAccountController } = require("./myAccount");
const { publicController } = require("./public");
const { registerController } = require("./register");
const { registerUserController } = require("./registerUser");
const { editController } = require("./edit");
const { pageNotFound } = require("./404");
const { loginUserController } = require("./loginUser");
const { unsplashController } = require("./unsplash");
const { myPhotosUnsplashController } = require("./myPhotosUnsplash");
const { disconnectUnsplashController } = require("./disconnectUnsplash");
const { disconnectTwitterController } = require("./disconnectTwitter");
const { logoutController } = require('./logout')
const { getUnsplashImageInfoController } = require('./getUnsplashPhoto');
const { meController } = require('./me');
const { updateUserController } = require('./updateUser');
const { deleteAccountController } = require('./deleteAccount');
const { imageController } = require('./image');
const { myAccountTwitterController } = require('./myAccountTwitter');
const { twitterAuthController } = require('./twitterAuth');
const { myPhotosTwitterController } = require('./myPhotosTwitter');
const { postTweetController } = require('./postTweet');
const { uploadController } = require('./upload');
const { publicImagesController } = require('./publicImages');
const { getRandomImagesTwitterController } = require('./getRandomImagesTwitter');
const { adminUserController } = require('./adminUser');
const { adminImageController } = require('./adminImage');

module.exports = {
    loginController,
    loginUserController,
    contactController,
    exploreController,
    editController,
    // forgotPasswordController,
    infoController,
    myAccountController,
    publicController,
    registerController,
    registerUserController,
    pageNotFound,
    unsplashController,
    myPhotosUnsplashController,
    disconnectUnsplashController,
    disconnectTwitterController,
    logoutController,
    getUnsplashImageInfoController,
    meController,
    updateUserController,
    deleteAccountController,
    imageController,
    myAccountTwitterController,
    twitterAuthController,
    myPhotosTwitterController,
    postTweetController,
    uploadController,
    publicImagesController,
    getRandomImagesTwitterController,
    adminUserController,
    adminImageController
};
