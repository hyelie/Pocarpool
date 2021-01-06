var express = require('express');
const { route } = require('.');
var pool = require('../db/initiate').pool;
var sqlQuery = require('../db/initiate').checkQuery;
var template = require('../HTML/template').template;
var router = express.Router();
var request = require('request');
var IsLogined = require('../auth/IsLogined');
var SSOredirect = require('../auth/SSOredirect');

router.get("/login_process",SSOredirect());
router.get("/login", IsLogined);

// 로그아웃
router.get('/logout', function (req, res, next) {
    console.log("로그아웃");

    if(req.session.user == undefined){
        console.log("로그인 안되있음")
        return res.redirect('/');
    }

    req.session.destroy(function(err){
        if(err){
            console.log("세션삭제 에러 발생");
            return;
        }
        console.log("로그아웃 성공");
        res.redirect('/');
    });
});

router.get('/login_success', (req, res, next) => {
    console.log("로그인 성공 창");
    res.status(200).send('login_success');
})

module.exports = router;