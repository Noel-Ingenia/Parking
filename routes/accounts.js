var express = require('express');
var router = express.Router();
const sql = require('mssql');
var conection = require('./conection');

/* GET lista de usuarios */
router.get('/', function(req, res, next) {
  sql.connect(conection, err => {
    new sql.Request().query('select * from TablaPrueba', (err, result) => {
        console.dir(result.recordset);
        res.json(result.recordset);
        sql.close();
    });
  });
});

module.exports = router;
