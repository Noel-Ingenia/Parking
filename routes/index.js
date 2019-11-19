var express = require('express');
var router = express.Router();
const sql = require('mssql');

const config = {
  user: 'usuariotest',
  password: 'Dao*test*2019',
  server: '192.168.16.45',
  database: 'BASEDATOSINGENIAPRUEBAS',
};

sql.connect(config, err => {
  new sql.Request().query('select * from TablaPrueba', (err, result) => {
      console.dir(result.recordset);
    });
});

module.exports = router;
