var express = require('express');
var router = express.Router();
var connection = require('../db/initiate').connection;
var sqlQuery = require('../db/initiate').checkQuery;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log('DB 확인합니다...')
  connection.query(sqlQuery.checkDBs, function(err, results){
    if(err) throw error;
    console.log("DB : ", results);
    console.log('Tables 확인합니다...')
    connection.query(sqlQuery.checkTables, function(err, results){
      if(err) throw error;
      console.log("Tables : ", results);
    });
  })
});

module.exports = router;
