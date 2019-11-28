var express = require('express');
var router = express.Router();
const sql = require('mssql');
const config = require('../config');
const querys = require('../querys');

// GET DATOS DE USUARIO Y PLAZA ////////////////////////////////////////////////////////////////////////////
router.get('/', function(req, res, next) {
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
    // POR ID DE USUARIO
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

module.exports = router;
