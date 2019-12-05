var express = require('express');
var router = express.Router();
const querys = require('../querys');
const auth = require('../middlewares/checkAuth');
const moment = require('moment');

// OBTIENE DATOS DE USUARIO Y PLAZA ////////////////////////////////////////////////////////////////////////////
router.get('/', /*auth,*/  function(req, res, next) {

  if (req.query.IdGroup) {
    // SI PERTENECE A GRUPO: OBTIENE LAS PLAZAS DEL GRUPO
    querys.QueryFunction( param1 = req.query.IdGroup, param2 = null, query = querys.homeGetGroupPlaces)
      .then( data => {
        res.json(data);
      });
  } else if (req.query.IdUser) {

    // SI NO PERTENECE A GRUPO: OBTIENE LA PLAZA DEL USUARIO
    querys.QueryFunction( param1 = req.query.IdUser, param2 = null, query = querys.homeGetUserPlace)
      .then(data => {

        if (data[0] != null) {

          day01 =  { ParkingName: data[0].ParkingName, MapUrl: data[0].MapUrl, PlaceName: data[0].PlaceName, Liberado: false,
            SelectedDay: moment().format().substring(0, 10) };
          day02 =  { ParkingName: data[0].ParkingName, MapUrl: data[0].MapUrl, PlaceName: data[0].PlaceName, Liberado: false,
              SelectedDay: moment().add(1, 'days').format().substring(0, 10) };
          days = [];
          days.push(day01);
          days.push(day02);
          //console.log(days);

          // SI TIENE PLAZA: OBTIENE DIAS LIBERADOS DE LA PLAZA
          querys.QueryFunction( param1 = req.query.IdUser, param2 = null, query = querys.homeGetUserReleasedDays )
          .then( data01 => {

            if (data01[0] != null) {

              day03 =  { ParkingName: data01[0].ParkingName, MapUrl: data01[0].MapUrl, PlaceName: data01[0].PlaceName, Liberado: false,
                SelectedDay: moment(data01[0].SelectedDay).format().substring(0, 10) };
              days2 = [];
              days2.push(day03);

              if (data01[1] != null) {
                day04 =  { ParkingName: data01[1].ParkingName, MapUrl: data01[1].MapUrl, PlaceName: data01[1].PlaceName, Liberado: false,
                  SelectedDay: moment(data01[1].SelectedDay).format().substring(0, 10) };
                  days2.push(day04);
              }

              for(var i = 0; i < days.length; i++) {
                for (var j = 0; j < days2.length; j++) {
                  if (days[i].SelectedDay == days2[j].SelectedDay)
                  days[i].Liberado = true;
                }
              }
              //console.log(days);
              res.json( days );
            } else {
              res.json( days );
            }
          });

        } else {
          
          // SI NO TIENE PLAZA: OBTIENE LAS SOLICITUDES DE PLAZAS
          querys.QueryFunction( param1 = req.query.IdUser, param2 = null, query = querys.homeGetUserRequestDays)
          .then(data02 => {
            console.log(data02);

            if (data02[0] != null) {
              res.json(data02);
            } else {
              res.json( {
                respuesta: "No tiene solicitudes",
                data: data
              });
            }
          });
        }
      });
  }
});

// OBTIENE ROL DE USUARIO ////////////////////////////////////////////////////////////////////////////////////////
router.get('/rol', /*auth,*/ function(req, res, next) {
  if (req.body.IdUser) {

    querys.QueryFunction( param1 = req.body.IdUser, param2 = null, query = querys.getRol ).then(
      data => {
        res.json(data[0]);
      }
    );
  }
});

module.exports = router;
