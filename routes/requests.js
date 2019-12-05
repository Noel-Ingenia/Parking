var express = require('express');
var router = express.Router();
const sql = require('mssql');
const config = require('../config');
const querys = require('../querys');
const moment = require('moment');

router.get('/', function(req, res) {
  if (req.query.IdUser) {
    querys.QueryFunction( param1 = req.query.IdUser, param2 = null, query = querys.requestGet )
    .then( data => {
      if (data[0] != null) {
        res.json(data);
      } else {
        res.json("No tienes Solicitudes");
      }
    });
  } else {
    res.json("Faltan las propiedades");
  }
});

router.post('/', function(req, res) {
  if (req.query.IdUser && req.body) {
    sql.connect(config, function(err, resp){
      if(err)console.log(err);
      
      var firstDay = moment(req.body.date.begin);
      var lastDay = moment(req.body.date.end);
      var queryInsert = querys.requestDaysInsert + " ( @IdRequest, '" + firstDay.format().substring(0, 10) + "' )";

      while (firstDay < lastDay) {
        firstDay = moment(firstDay).add(1, 'days');
        queryInsert = queryInsert + ", ( @IdRequest, '" + firstDay.format().substring(0, 10) + "' )";
      }
      
      var transaction = new sql.Transaction();
      transaction.begin(function(err) {
        if (err) console.log(err);
        let rolledBack = false
        transaction.on('rollback', aborted => {
          rolledBack = true
        });
        
        var request = new sql.Request(transaction);
        request
        .input('IdUser', sql.Int, req.query.IdUser)
        .query(querys.requestInsert, function(err, result01) {
          controlError(err, rolledBack, transaction);

          request
          .input('IdRequest', sql.Int, result01.recordset[0].id)
          .query(queryInsert, function(err, result02) {
            controlError(err, rolledBack, transaction);

            transaction.commit(function(err, result03) {
              if(err) console.log(err);
              else {
                console.log("Transaction commited.");
                res.json("Insercion realizada");
              } 
            });
          }); 
        });
      });
    });
  } else {
    res.json("Faltan las propiedades");
  }
});

function controlError(err, rolledBack, transaction) {
  if (err) {
    console.log(err);
    if (!rolledBack) {
      transaction.rollback(function (err) { throw err; });
    }
  }
}

module.exports = router;


