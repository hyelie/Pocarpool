const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const DB = require('../db/db_connect')

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

    /*
    DB.query('',(err)=>{
        
    })
    */
    res.send('GET /roomlist?');
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