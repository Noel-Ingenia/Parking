const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');

function createToken(user) {
    console.log(user.Id);
    const payload = {
        Id: user.Id,
        EmployeeName: user.EmployeeName,
        EmployeeSurname: user.EmployeeSurname,
        Email: user.Email,
        IdGroup: user.IdGroup,
        iat: moment(),
        exp: moment().add(1, 'minutes'),
    }
    return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeToken(token) {
    const decode = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.SECRET_TOKEN);

            console.log("Tiempo para expirar:     " + (moment(payload.exp) - moment()));

            if ((moment(payload.exp) < moment())){
                reject({
                    status: 401,
                    message: "Token ha expirado"
                });
            }
            resolve(payload.Id);
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