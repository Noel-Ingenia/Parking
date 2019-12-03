var express = require('express');
var router = express.Router();
const querys = require('../querys');
const auth = require('../middlewares/checkAuth');
const moment = require('moment');

// OBTIENE DATOS DE USUARIO Y PLAZA ////////////////////////////////////////////////////////////////////////////
router.get('/', /*auth,*/  function(req, res, next) {

  if (req.query.IdGroup) {
    // SI PERTENECE A GRUPO: OBTIENE DIAS LIBERADOS DEL GRUPO
    querys.QueryFunction( paramInt = req.query.IdGroup, paramString = null, query = querys.homeGetGroupReleasedDays)
     .then( data => {
       res.json(data);
      } );
  } else if (req.query.IdUser) {
    // SI NO PERTENECE A GRUPO: OBTIENE DIAS LIBERADOS DEL USUARIO
    querys.QueryFunction( paramInt = req.query.IdUser, paramString = null, query = querys.homeGetUserReleasedDays )
    .then( data => {
      if (data[0] != null) {
        res.json(data);
      } else {
        // SI NO TIENE ASIGNACIONES: OBTIENE PETICIONES DE PLAZAS
        querys.QueryFunction( paramInt = req.query.IdUser, paramString = null, query = querys.homeGetUserRequestDays)
        .then(data01 => {
          if (data01[0] != null) {
            res.json(data01);
          } else {
            res.json("No tiene libreaciones");
          }
        });
      }
    });
  }
});

// OBTIENE ROL DE USUARIO ////////////////////////////////////////////////////////////////////////////////////////
router.get('/rol', /*auth,*/ function(req, res, next) {
  if (req.body.IdUser) {

    querys.QueryFunction( paramInt = req.body.IdUser, paramString = null, query = querys.getRol ).then(
      data => {
        res.json(data[0]);
      }
    );
  }
});

module.exports = router;
