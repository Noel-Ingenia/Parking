var express = require('express');
var router = express.Router();
const sql = require('mssql');
var datosConexion = require;

const config = {
  user: 'usuariotest',
  password: 'Dao*test*2019',
  server: '192.168.16.45',
  database: 'BASEDATOSINGENIAPRUEBAS',
};

/* GET lista de usuarios */
router.get('/', function(req, res, next) {
  sql.connect(config, err => {
    new sql.Request().query('select * from TablaPrueba', (err, result) => {
        console.dir(result.recordset);
        res.json(result.recordset);
        sql.close();
    });
  });
});

module.exports = router;
