var express = require('express');
var router = express.Router();
const sql = require('mssql');
var conection = require('./conection');

sql.connect(conection, err => {
  new sql.Request().query('select * from TablaPrueba', (err, result) => {
      console.dir(result.recordset);
      sql.close();
    });
});

module.exports = router;
