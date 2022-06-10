const path = require('path');
const fs = require('fs');

function getView(url) {
    return fs.readFileSync(path.join(__dirname, url))
}

let view404 = getView('./404.html')
let viewContact = getView('./contact.html');
let viewEdit = getView('./edit.html');
let viewExplore = getView('./explore.html');
let viewForgotPassword = getView('./forgotPassword.html');
let viewLogin = getView('./index.html');
let viewInfo = getView('./info.html');
let viewMyAccount = getView('./myAccount.html');
let viewRegister = getView('./register.html');

module.exports = {
    view404, viewContact, viewEdit, viewExplore, viewForgotPassword,
    viewInfo, viewMyAccount, viewRegister, viewLogin
}
