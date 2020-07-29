const express = require('express');
const router = express.Router();
var DB = require('../db/initiate').connection;

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

    // 1. MySql query문 만들기
    var property = ``
    property = property + ((req.query.depart_place != undefined) ? `depart_place='${req.query.depart_place}'` : ``)
    property = property + ((property != `` && req.query.arrive_place != undefined) ? ` AND ` : ``) + ((req.query.arrive_place != undefined) ? `arrive_place='${req.query.arrive_place}'` : ``)
    property = property + ((property != `` && req.query.depart_time != undefined) ? ` AND ` : ``) + ((req.query.depart_time != undefined) ? `depart_time='${req.query.depart_time}'` : ``)
    property = property + ((property != `` && req.query.arrive_time != undefined) ? ` AND ` : ``) + ((req.query.arrive_time != undefined) ? `arrive_time='${req.query.arrive_time}'` : ``)
    // 쿼리 완성
    if(property == ``){
        var sql = `SELECT * FROM roominfos`
    }
    else{
        var sql = `SELECT * FROM roominfos WHERE ${property}`
    }   

    // 2. DB.query로 보내서 출력 가져오기
    DB((err,connection)=>{
        if(!err){
            connection.query(sql,(err,rows,fields)=>{
                if (err) throw err;
                console.log(rows)
                connection.release();

                res.json(rows) // 3. 사용자에게 json 형식으로 출력하기
                res.status(200).end()
            })
        }        
    })   
});

// POST /roomlist
// (필수적으로) 입력 되는 값: car_type, depart_place, arrive_place, depart_time, arrive_time
router.post('/',(req,res,next)=>{
    
    console.log(req.body)
    car_type = req.body.car_type
    depart_place = req.body.depart_place
    arrive_place = req.body.arrive_place
    depart_time = req.body.depart_time
    arrive_time = req.body.arrive_time    

    // 시간 검사용 정규표현식
    var regExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    // 오류처리
    if((car_type != "자가용" && car_type != "택시") || depart_place == undefined || arrive_place == undefined || !regExp.test(depart_time) || !regExp.test(arrive_time)){
        next(new Error('POST /roomlist error:1'));
    }
    else{
        // 1. MySql query문 만들기
        var property = `'${car_type}','${depart_place}','${arrive_place}','${depart_time}','${arrive_time}'`
        //var property = `'자가용','지곡회관','공학동',NOW(),NOW()` //시간: 2020-07-29 14:10:23 형태를 한다
        var sql = `INSERT INTO roominfos (car_type, depart_place, arrive_place, depart_time, arrive_time,current_headcount, total_headcount, curreunt_carrier_num, total_carrier_num, userId, isConfirm, confirm_time) VALUES(${property},0,4,0,4,0,0,NOW())`;
        
        // 2. DB.query로 보내서 출력 가져오기
        DB((err,connection)=>{
            if(!err){
                connection.query(sql,(err,rows,fields)=>{
                    if (err) throw err;
                    connection.release();
                })
            }       
        })
        res.status(200)
        res.redirect('/')
        res.end()
    }   
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

// 오류 처리기
router.use((err,req,res,next)=>{
    res.json({ message: err.message });
})

module.exports = router;