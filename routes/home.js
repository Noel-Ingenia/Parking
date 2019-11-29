var express = require('express');
var router = express.Router();
const querys = require('../querys');
const auth = require('../middlewares/checkAuth');

// OBTIENE DATOS DE USUARIO Y PLAZA ////////////////////////////////////////////////////////////////////////////
router.get('/', auth,  function(req, res, next) {
  if (req.body.IdGroup) {
    // SI PERTENECE A GRUPO: OBTIENE DIAS LIBERADOS
    querys.QueryFunction( paramInt = req.body.IdGroup, paramString = null, query = querys.homeGetGroupReleasedDays)
     .then( data => { res.json(data); } );
  } else if (req.body.IdUser) {
    // SI NO PERTENECE A GRUPO: OBTIENE DIAS SOLICITADOS
    querys.QueryFunction( paramInt = req.body.IdUser, paramString = null, query = querys.homeGetUserRequestDays)
    .then( data => {
      if (data[0] != null) {
          // SI HA SOLICITADO DIAS: OBTIENE ASIGNACIONES
          querys.QueryFunction( paramInt = req.body.IdUser, paramString = null, query = querys.homeGetUserAssignations)
          .then( data => { res.json(data); } );
        }
        else {
          // SI NO HA SOLICITADO DIAS: OBTIENE DIAS LIBERADOS
          querys.QueryFunction( paramInt = req.body.IdUser, paramString = null, query = querys.homeGetUserReleasedDays )
          .then( data => { res.json(data); } );
        }
      }
    );
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
