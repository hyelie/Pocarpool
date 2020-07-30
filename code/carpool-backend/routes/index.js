var express = require('express');
const { connection } = require('../db/initiate');
var DB = require('../db/initiate').connection;
var sqlQuery = require('../db/initiate').checkQuery;
var template = require('../HTML/template').template;
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user == undefined){
    console.log("로그인 확인", req.user);
    res.send(template.home(req));
  } else{
    res.redirect('/login');
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
  console.log('DB 확인합니다...')
  DB((poolerr, connection) =>{
    connection.query(sqlQuery.checkDBs, function(err, results){
      if(err) throw err;
      console.log("DB : ", results);
      connection.release();
    });
  });
  console.log('Tables 확인합니다...');
  DB((poolerr, connection) =>{
    connection.query(sqlQuery.checkTables, function(err, results){
      if(err) throw err;
      console.log("Tables : ", results);
      connection.release();
    });
  });
});

module.exports = router;
