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

// 로그인
router.get('/login', function(req, res, next) {
  res.send(template.login);
});

// 회원가입
router.get('/register', function(req, res, next) {
  res.send(template.register);
});

// 회원가입 단계
router.post('/register_process', function(req, res, next) {
  var username = req.body.name;
  var userid = req.body.id;
  var userpw = req.body.pwd;

  DB((poolerr, connection) =>{
    if(!poolerr){
      console.log("확인할거야!", username, userid, userpw);
      var adduserquery = `INSERT INTO carpoolDB.users(name, memberID, memberPW) VALUES (?, ?, ?)`;
      connection.query(adduserquery, [username, userid, userpw],  function(err, results, fields){
        if(err){
          console.log("이미 존재하는 ID입니다!");
        } else{
          console.log("등록 완료~");
        }
        connection.release();
      });
    }
  });

  
});

module.exports = router;
