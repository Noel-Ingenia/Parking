var express = require('express');
var router = express.Router();
const sql = require('mssql');
const config = require('../config');

// GET USUARIOS ////////////////////////////////////////////////////////////////////////////
router.get('/', function(req, res, next) {
  if (req.query.id) {
    // SELECT por ID 
    sql.connect(config, err => {
      new sql.Request()
        .input('value', sql.Int, req.query.id) // ID A BUSCAR
        .query('SELECT * FROM Employee WHERE id = @value', (err, result) => {
          console.dir(result.recordset);
          res.json(result.recordset);
          sql.close();
      });
    });
  } else {
    /* SELECT todos*/
    sql.connect(config, err => {
      new sql.Request()
        .query('SELECT * FROM Employee', (err, result) => {
          console.dir(result.recordset);
          res.json(result.recordset);
          sql.close();
      });
    });
  }
});

// CREAR ///////////////////////////////////////////////////////////////////////////////////
router.post('/', function(req, res, next) {
  if (req.body) {
    /* INSERT */
    var id = 0;
    sql.connect(config, err => {
      new sql.Request()
        .input('cadenaUno', sql.VarChar, req.body.Email) // NOMBRE A CREAR
        .input('cadenaDos', sql.VarChar, req.body.Password) // APELLIDO A CREAR
        .query('INSERT INTO Employee (pruebaCadena, pruebaCadenaDos) OUTPUT INSERTED.id VALUES (@cadenaUno, @cadenaDos)')
        .then(result => {
          console.log(result);
          res.json("Usuario Creado");
          sql.close();
        });
    });
  } else {
    res.json("Faltan las propiedades en el body");
  }
});

// ACTUALIZAR //////////////////////////////////////////////////////////////////////////////
router.put('/', function(req, res, next) {
  if (req.body) {
    /* UPDATE por ID */
    sql.connect(config, err => {
      new sql.Request()
      .input('id', sql.Int, req.body.id) // ID A ACTUALIZAR
      .input('cadenaUno', sql.VarChar, req.body.pruebaCadena) // NOMBRE A ACTUALIZAR
      .input('cadenaDos', sql.VarChar, req.body.pruebaCadenaDos) // APELLIDO A ACTUALIZAR
      .query("UPDATE Employee SET pruebaCadena = @cadenaUno, pruebaCadenaDos = @cadenaDos WHERE id = @id", (err, result) => {
        console.dir(result);
        res.json(result);
        sql.close();
    });
    });
  } else {
    res.json("Faltan las propiedades en la ruta");
  }
});

// BORRAR /////////////////////////////////////////////////////////////////////////////////
router.delete('/', function(req, res, next) {
  if (req.query.id) {
    /* DELETE por ID*/
    sql.connect(config, err => {
      new sql.Request()
        .input('id', sql.VarChar, req.query.id) // ID A BORRAR
        .query('DELETE FROM Employee WHERE id = @id')
        .then(result => {
          console.log(result);
          res.json("Usuario Borrado");
          sql.close();
        });
    });
  } else {
    res.json("Faltan las propiedades en la ruta");
  }
});
module.exports = router;
