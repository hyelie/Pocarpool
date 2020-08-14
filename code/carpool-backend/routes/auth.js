var express = require('express');
const { route } = require('.');
var pool = require('../db/initiate').pool;
var sqlQuery = require('../db/initiate').checkQuery;
var template = require('../HTML/template').template;
var router = express.Router();
const passport = require('passport');

// 일단 간단하게 짠거니까 url 및 보안은 크게 신경쓰지 마세요, 통합 로그인 구축되면 수정합니다.
// 로그인
router.get('/login', function (req, res, next) {
    res.status(200);
    res.send(template.login);
});

// 로그인 단계
router.post('/login_process', passport.authenticate('local', {
    successRedirect: '/login',
    failureRedirect: '/auth/login'
}));

// 회원가입
router.get('/register', function (req, res, next) {
    res.status(200);
    res.send(template.register);
});

// 회원가입 단계
router.post('/register_process', function (req, res, next) {
    console.log("회원가입 시작.");
    var username = req.body.name;
    var userid = req.body.id;
    var userpw = req.body.pwd;
    pool.getConnection(function(poolerr, connection){
        if (!poolerr) {
            console.log("회원가입 정보 확인", username, userid, userpw);
            var adduserquery = `INSERT INTO carpoolDB.users(name, memberID, memberPW) VALUES (?, ?, ?)`;
            connection.query(adduserquery, [username, userid, userpw], function (err, results, fields) {
                if (err) {
                    console.log("이미 존재하는 ID입니다!");
                    res.redirect('/auth/register');  
                } else {
                    console.log("등록 완료~");
                    res.redirect('/');
                }
            });
        }
        console.log(pool._freeConnections.indexOf(connection));
        connection.release();
        console.log(pool._freeConnections.indexOf(connection));
    });
});

// 로그아웃
router.get('/logout', function (req, res, next) {
    if(req.user == undefined){
        res.redirect('/');
    }
    console.log("로그아웃");
    req.logout();
    req.session.destroy(function(err){
        res.redirect('/');
    });
});

module.exports = router;