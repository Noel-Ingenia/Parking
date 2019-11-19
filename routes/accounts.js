var express = require('express');
var router = express.Router();
const sql = require('mssql');
var conection = require('./conection');

/* GET lista de usuarios */
// router.get('/', function(req, res, next) {
//   sql.connect(conection, err => {
//     new sql.Request().query('select * from TablaPrueba', (err, result) => {
//         console.dir(result.recordset);
//         res.json(result.recordset);
//         sql.close();
//     });
//   })
// });

/* GET Usuario por ID */
router.get('/', function(req, res, next) {
  if (req.query.id){
    sql.connect(conection, err => {
      new sql.Request()
        .input('value', sql.Int, req.query.id) //AQUI VA EL ID A BUSCAR
        .query('select * from TablaPrueba where id = @value', (err, result) => {
          console.dir(result.recordset);
          res.json(result.recordset);
          sql.close();
      });
    });
  } else {
    sql.connect(conection, err => {
      new sql.Request()
        .query('select * from TablaPrueba', (err, result) => {
          console.dir(result.recordset);
          res.json(result.recordset);
          sql.close();
      });
    });
  }
});

module.exports = router;
