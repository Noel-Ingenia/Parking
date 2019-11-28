var express = require('express');
var router = express.Router();
const sql = require('mssql');
const config = require('../config');
const querys = require('../querys');
const auth = require('../middlewares/checkAuth');

// GET DATOS DE USUARIO Y PLAZA ////////////////////////////////////////////////////////////////////////////
router.get('/', /*auth,*/  function(req, res, next) {
  if (req.body.IdGroup) {
    // POR ID DE GRUPO
    sql.connect(config, err => {
      new sql.Request()
        .input('IdGroup', sql.Int, req.body.IdGroup)
        .query(querys.homeGroup, (err, result) => {
          console.dir(result.recordset);
          res.json(result.recordset);
          sql.close();
      });
    });
  } else if (req.body.IdUser) {
    // COMPRUEBA SI EL USUARIO HA SOLICITADO DIAS
    sql.connect(config, err => {
      new sql.Request()
        .input('IdUser', sql.Int, req.body.IdUser) // ID A BUSCAR
        .query(querys.homeRequestDays, (err, result) => {
          console.dir(result.recordset);
          sql.close();
          if (result.recordset[0] != null) {
            res.json(result.recordset);
            
            sql.connect(config, err => {
              new sql.Request()
                .input('IdUser', sql.Int, req.body.IdUser) // ID A BUSCAR
                .query(querys.homeUser, (err, result) => {
                  console.dir(result.recordset);
                  res.json(result.recordset);
                  sql.close();
              });
            });
          }
          else {
            sql.connect(config, err => {
              new sql.Request()
                .input('IdUser', sql.Int, req.body.IdUser) // ID A BUSCAR
                .query(querys.homeUser, (err, result) => {
                  console.dir(result.recordset);
                  res.json(result.recordset);
                  sql.close();
              });
            });
          }
      });
    });
  }
});

// GET ROL ///////////////////////////////////////////////////////////////////////////////////////////
router.get('/rol', /*auth,*/ function(req, res, next) {
  if (req.body.IdUser) {
    // POR ID DE GRUPO
    sql.connect(config, err => {
      new sql.Request()
        .input('IdUser', sql.Int, req.body.IdUser)
        .query(querys.getRol, (err, result) => {
          console.dir(result.recordset);
          res.json(result.recordset);
          sql.close();
      });
    });
  }
});

module.exports = router;
