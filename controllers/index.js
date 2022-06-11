const { loginController } = require("./login");
const { contactController } = require("./contact");
const { exploreController } = require("./explore");
const { forgotPasswordController } = require("./forgotPassword");
const { infoController } = require("./info");
const { myAccountController } = require("./myAccount");
const { publicController } = require("./public");
const { registerController } = require("./register");
const { registerUserController } = require("./registerUser");
const { editController } = require("./edit");
const { pageNotFound } = require("./404");
const { loginUserController } = require("./loginUser");
const { unsplashController } = require("./unsplash");
const { myPhotosController } = require("./myPhotos");
const { disconnectController } = require("./disconnect");
const { logoutController } = require('./logout')
const { getUnsplashImageInfoController } = require('./getUnsplashPhoto');
const { meController } = require('./me');
const { updateUserController } = require('./updateUser');
const { deleteAccountController } = require('./deleteAccount');
module.exports = {
    loginController,
    loginUserController,
    contactController,
    exploreController,
    editController,
    forgotPasswordController,
    infoController,
    myAccountController,
    publicController,
    registerController,
    registerUserController,
    pageNotFound,
    unsplashController,
    myPhotosController,
    disconnectController,
    logoutController,
    getUnsplashImageInfoController,
    meController,
    updateUserController,
    deleteAccountController
};
