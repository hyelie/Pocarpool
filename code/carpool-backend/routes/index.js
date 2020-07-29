var express = require('express');
const { connection } = require('../db/initiate');
var DB = require('../db/initiate').connection;
var sqlQuery = require('../db/initiate').checkQuery;
var template = require('../HTML/template').template;
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(template.home);
  //res.render('index', { title: 'Express' });
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
