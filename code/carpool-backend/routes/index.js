var express = require('express');
const pool = require('../db/initiate').pool
var sqlQuery = require('../db/initiate').checkQuery;
var template = require('../HTML/template').template;
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user == undefined){
    console.log("로그인 확인", req.user);
    res.redirect('/auth/login');
  } else{
    res.redirect('/auth/login_success');
  }
});

router.get('/login', function(req, res, next) {
  if(req.user == undefined){
    res.redirect('/');
  } else{
    console.log("로그인 확인", req.user);
    res.send(template.home(req));
  }
});

router.get('/DBcheck', function(req, res, next){
  console.log('DB 확인합니다...');

  pool.getConnection(function (err, connection) {
    connection.query(sqlQuery.checkDBs, function (err, results) {
      if (err) throw err;
      console.log("DB : ", results);
      connection.release();
    });
    console.log(pool._freeConnections.indexOf(connection));
    connection.release();
    console.log(pool._freeConnections.indexOf(connection));
  });
  pool.getConnection(function (err, connection) {
    connection.query(sqlQuery.checkTables, function(err, results){
      if(err) throw err;
      console.log("Tables : ", results);
      connection.release();
    });
    console.log(pool._freeConnections.indexOf(connection));
    connection.release();
    console.log(pool._freeConnections.indexOf(connection));
  });
});

module.exports = router;
