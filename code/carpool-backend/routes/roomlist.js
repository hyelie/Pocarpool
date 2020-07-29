const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const DB = require('../db/db_connect').connected_db()

// GET /roomlist
// GET /roomlist? 
// depart_place, arrive_place, depart_time, arrive_time 총 4개를 Query로 받을 수 있다. (출발장소, 도착장소, 출발시간, 도착시간)
router.get('/', function(req, res, next) {
    /* query의 데이터들은 아래의 형식으로 들어오는 것을 확인할 수 있다.
    console.log(req.query.depart_place)
    console.log(req.query.arrive_place)
    console.log(req.query.depart_time)
    console.log(req.query.arrive_time)
    */

    // 1. MySql query문 만들기
    // 2. DB.query로 보내서 출력 가져오기
    // 3. 사용자에게 json 형식으로 출력하기

    /*
    DB.query('SELECT * FROM users',(err, rows, fields)=>{
        // error will be an Error if one occurred during the query
        // rows will contain the results of the query
        // fields will contain information about the returned results fields (if any)

        //console.log(rows)
        //console.log(fields)
    })
    */

    // 1. MySql query문 만들기
    var property = ``
    property = property + ((req.query.depart_place != undefined) ? `depart_place='${req.query.depart_place}'` : ``)
    property = property + ((property != `` && req.query.arrive_place != undefined) ? ` AND ` : ``) + ((req.query.arrive_place != undefined) ? `arrive_place='${req.query.arrive_place}'` : ``)
    property = property + ((property != `` && req.query.depart_time != undefined) ? ` AND ` : ``) + ((req.query.depart_time != undefined) ? `depart_time='${req.query.depart_time}'` : ``)
    property = property + ((property != `` && req.query.arrive_time != undefined) ? ` AND ` : ``) + ((req.query.arrive_time != undefined) ? `arrive_time='${req.query.arrive_time}'` : ``)
    // 쿼리 완성
    var sql = `SELECT * FROM roominfos WHERE ${property}`

    // 2. DB.query로 보내서 출력 가져오기
    DB.query(sql,(err,rows,fields)=>{
        if (err) throw err;
        res.json(rows) // 3. 사용자에게 json 형식으로 출력하기
        console.log(rows)
    })
});

// POST /roomlist
router.post('/',(req,res)=>{
    res.send('POST /roomlist');
});
// PUT /roomlist
router.put('/',(req,res)=>{
    res.send('PUT /roomlist');
});
// DELETE /roomlist
router.delete('/',(req,res)=>{
    res.send('DELETE /roomlist');
});


// GET /roomlist/userid?id=
router.get('/userid', function(req, res, next) {
    res.send('GET /roomlist?');
});
// POST /roomlist/userid
router.post('/userid', function(req, res, next) {
    res.send('POST /roomlist/userid');
});
// DELETE /roomlist/userid
router.delete('/userid',(req,res)=>{
    res.send('DELETE /roomlist/userid');
});



module.exports = router;