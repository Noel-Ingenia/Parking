var express = require('express');
var router = express.Router();
const sql = require('mssql');
const config = require('../config');

router.get('/', function(req, res, next) {
  sql.connect(config, err => {
    new sql.Request().query('select * from TablaPrueba', (err, result) => {
        //console.dir(result.recordset);
        sql.close();
      });
  });
});

module.exports = router;
