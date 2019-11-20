var express = require('express');
var router = express.Router();
const sql = require('mssql');
var conection = require('./conection');

/* GET USUARIOS *///////////////////////////////////////////////////////////////////////////
router.get('/', function(req, res, next) {
  if (req.query.id) {
    // SELECT por ID 
    sql.connect(conection, err => {
      new sql.Request()
        .input('value', sql.Int, req.query.id) // ID A BUSCAR
        .query('SELECT * FROM TablaPrueba WHERE id = @value', (err, result) => {
          console.dir(result.recordset);
          res.json(result.recordset);
          sql.close();
      });
    });
  } else {
    /* SELECT todos*/
    sql.connect(conection, err => {
      new sql.Request()
        .query('SELECT * FROM TablaPrueba', (err, result) => {
          console.dir(result.recordset);
          res.json(result.recordset);
          sql.close();
      });
    });
  }
});

/* CREAR *//////////////////////////////////////////////////////////////////////////////////
router.post('/', function(req, res, next) {
  if (req.body) {
    /* INSERT */
    sql.connect(conection, err => {
      new sql.Request()
        .input('nombre', sql.VarChar, req.body.pruebaCadena) // NOMBRE A CREAR
        .input('apellido', sql.VarChar, req.body.pruebaCadenaDos) // APELLIDO A CREAR
        .query('INSERT INTO TablaPrueba (pruebaCadena, pruebaCadenaDos) VALUES (@nombre, @apellido)' )
        .then(result => {
        console.log(result);
        res.json("Usuario Creado");
        sql.close();
      });
    });
  } else {
    res.json("Faltan las propiedades en la ruta");
  }
});

/* ACTUALIZAR */////////////////////////////////////////////////////////////////////////////
router.put('/', function(req, res, next) {
  if (req.query.id && req.query.nombre && req.query.apellido) {
    /* UPDATE por ID */
    sql.connect(conection, err => {
      new sql.Request()
      .input('id', sql.VarChar, req.query.id) // ID A ACTUALIZAR
      .input('nombre', sql.VarChar, req.query.nombre) // NOMBRE A ACTUALIZAR
      .input('apellido', sql.VarChar, req.query.apellido) // APELLIDO A ACTUALIZAR
      .query("UPDATE TablaPrueba SET pruebaCadena = @nombre, pruebaCadenaDos = @apellido WHERE id = @id", (err, result) => {
        console.dir(result);
        res.json(result);
        sql.close();
    });
    });
  } else {
    res.json("Faltan las propiedades en la ruta");
  }
});

/* BORRAR *////////////////////////////////////////////////////////////////////////////////
router.delete('/', function(req, res, next) {
  if (req.query.id) {
    /* DELETE por ID*/
    sql.connect(conection, err => {
      new sql.Request()
        .input('id', sql.VarChar, req.query.id) // ID A BORRAR
        .query('DELETE FROM TablaPrueba WHERE id = @id')
        .then(result => {
          console.log(result);
          res.json("Usuario Borrado");
        });
    });
  } else {
    res.json("Faltan las propiedades en la ruta");
  }
});
module.exports = router;
