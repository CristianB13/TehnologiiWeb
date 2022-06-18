const jwt = require('jsonwebtoken');
function getPostData(req) {
    return new Promise((resolve, reject) => {
        try{
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            })
            
            req.on('end', () => {
                resolve(JSON.parse(body));
            })
        } catch (error) {
            reject(error);
        }

    });
}

function parseCookies (req) {
    const list = {};
    const cookiesHeader = req.headers?.cookie;
    if (!cookiesHeader) return list;

    cookiesHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...values] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = values.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

function auth(req, res){
    let cookies = parseCookies(req);
    if(!cookies.Token){
        return false;
    }
    try{
        const decoded = jwt.verify(cookies.Token, process.env.ACCESS_TOKEN_SECRET);
        console.log("token decoded", decoded);
        return decoded;
    } catch(err){
        console.log('token not valid or expired');
        if(!cookies.RefreshToken){
            return false;
        }
        try {
            const refreshTokenDecoded =  jwt.verify(cookies.RefreshToken, process.env.ACCESS_TOKEN_SECRET);
            const token = jwt.sign({"username": refreshTokenDecoded.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2m'});
            const refreshToken = jwt.sign({"username": refreshTokenDecoded.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '6h'});
            res.writeHead(200, [['Set-Cookie', `Token=${token}; HttpOnly; Max-Age=2147483647`],
                                ['Set-Cookie', `RefreshToken=${refreshToken}; HttpOnly; Max-Age=2147483647`]]);
            console.log(refreshTokenDecoded);
            return refreshTokenDecoded;
        } catch(error) {
            console.log(error);
            console.log('refresh token not valid or some malicious events happened');
            return false;
        }
    }
}

function randomStr(len, arr) {
    let ans = '';
    for (let i = len; i > 0; i--) {
        ans += 
          arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

module.exports = {
    getPostData,
    auth,
    parseCookies,
    randomStr
}
