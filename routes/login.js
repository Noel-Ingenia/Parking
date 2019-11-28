const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config');
const services = require('../services/token');
const auth = require('../middlewares/checkAuth');
const mailer = require('../mail');

// VALIDATOR PARA USERNAME
var regexUserName = new RegExp(/^([A-Za-z0-9]){6,20}$/);

// AUTENTIFICACION (CREACION DE TOKEN) /////////////////////////////////////////////////////////////
router.post('/', function(req, res, next) {
    if (req.body.UserName && req.body.UserPassword) {

        if (regexUserName.test(req.body.UserName)) {
            // PETICION A LA BBDD
            sql.connect(config, err => {
                new sql.Request()
                .input('UserName', sql.VarChar, req.body.UserName)
                .input('UserPassword', sql.VarChar, req.body.UserPassword)
                .query('SELECT * FROM Employee WHERE UserName = @UserName AND UserPassword = @UserPassword', (err, result) => {
                    if (err){
                        res.json(err);
                    } else {
                        if (result.rowsAffected[0] == 1) {
                            var user = result.recordset[0];
                            res.status(200).json({
                                user,
                                token: services.createToken(result.recordset[0])
                            });
                        }
                        else {
                            res.json({
                                message: "Usuario o contraseña incorrecta"
                            });
                        }
                    }
                    sql.close();
                });
            });
        } else {
            res.json({
                message: "Debes usar entre 6 y 20 caracteres, incluidos letras, numeros"
            });
        }
    } else {
        res.json("Faltan las propiedades en el body");
    }
});

// CONTRASEÑA OLVIDADA /////////////////////////////////////////////////////////////////////////////
router.post('/forgotPass', function(req, res, next) {
    if (req.body.Email) {

        //PETICION A LA BBDD
        sql.connect(config, err => {
            new sql.Request()
            .input('Email', sql.VarChar, req.body.Email)
            .query('select * from Employee WHERE Email = @Email', (err, result) => {
                console.dir(result.recordset);
                if (result.rowsAffected[0] == 1) {
                    mailer.sendMail(req.body.Email);
                    res.json("Correo Enviado");
                } else {
                    res.json("Correo no encontrado");
                }
                sql.close();
            });
        });
    } else {
      res.json("Debe introducir un Correo");
    }
});

// CAMBIO DE CONTRASEÑA ///////////////////////////////////////////////////////////////////////////
router.post('/changePass', function(req, res, next) {
    if (req.body.Email && req.body.UserPassword) {

        //PETICION A LA BBDD
        sql.connect(config, err => {
            new sql.Request()
            .input('Email', sql.VarChar, req.body.Email)
            .input('UserPassword', sql.VarChar, req.body.UserPassword)
            .query('UPDATE Employee SET UserPassword = @UserPassword WHERE Email = @Email', (err, result) => {
                if (err) {
                    res.json(err);
                } else {
                    res.json("Contraseña actualizada");
                }
                sql.close();
            });
        });
    } else {
      res.json("Faltan parametros en el body");
    }
});

// ACCESO CON TOKEN  ////////////////////////////////////////////////////////////////////
router.get('/private', auth, function(req, res, next) {
    res.status(200).json({
        message: "Acceso Correcto"
    });
});

module.exports = router;