const services = require('../services/token');

function isAuth (req, res, next){
    if (!req.headers.authorization) {
        return res.status(403).json({
            message: "No tienes autorizacion"
        });
    }

    console.log(req.headers.authorization);
    const token = req.headers.authorization;

    services.decodeToken(token)
        .then(response => {
            req.user = response;
            next();
        })
        .catch(response => {
            res.status(response.status).json({
                message: response.message
            });
        });
}

module.exports = isAuth;