const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');

function createToken(user) {
    console.log(user.Id);
    const payload = {
        sub: user.Id,
        iat: moment().unix,
        exp: moment().add(1, 'hour').unix,
    }
    return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeToken(token) {
    const decode = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.SECRET_TOKEN);

            if (payload.exp <= moment().unix()){
                reject({
                    status: 401,
                    message: "Token ha expirado"
                });
            }
            resolve(payload.sub);
        } catch(err) {
            reject({
                status: 500,
                message: "Invalid Token"
            });
        }
    });
    return decode;
}

module.exports = {
    createToken,
    decodeToken
};