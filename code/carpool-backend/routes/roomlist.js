const express = require('express');
const router = express.Router();
var DB = require('../db/initiate').connection;

// GET /roomlist
// GET /roomlist? 
// depart_place, arrive_place, depart_time, arrive_time 총 4개를 Query로 받을 수 있다. (출발장소, 도착장소, 출발시간, 도착시간)
router.get('/', function(req, res, next) {
    if(req.user == undefined){
        res.send("로그인 해주세요");
        res.end();
    }
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
        var sql = `SELECT * FROM carpooldb.roominfos`
    }
    else{
        var sql = `SELECT * FROM carpooldb.roominfos WHERE ${property}`
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
        DB((err1,connection)=>{
            if(!err1){
                connection.query(sql,(err2,rows,fields)=>{
                    if (err2) throw err;
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
    if(req.user == undefined){
        res.redirect('/');
    }
    // UPDATE tablename SET column1 = value1, column2 = value2, ... WHERE condition
    res.send('PUT /roomlist');

    console.log(req.body);
    var regExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    var updateData = [req.body.car_type, req.body.depart_place, req.body.arrive_place, req.body.depart_time, req.body.depart_place, req.body.current_headcount, req.body.current_carrier_num, req.body.total_carrier_num, req.body.isConfirm, req.body.isConfirm_time];

    // 입력 값 에러
    if(updateQueryArray.every(undefined) || !regExp.test(updateData[3]) || !regExp.test(updateData[4])){
        next(new Error('PUT /roomlist error:1'));
    } else{
        // query 생성
        var updateQuery = "UPDATE carpoolDB.roominfos SET";
        var roomCol = ["car_type", "depart_place", "arrive_place", "depart_time", "depart_place", "current_headcount", "current_carrier_num", "total_carrier_num", "isConfirm", "isConfirm_time"];
        var notNULLcolumn = new Array();
        var j = 0;
        for(var i = 0; i<updateData.length; i++){
            if(updateData[i] != undefined){
                updateQuery = updateQuery + " " + roomCol[i] + "=?,";
                notNULLcolumn[j] = updateQueryArray[i]; j++;
            }
        }
        updateQuery = updateQuery.slice(0, -1) + `WHERE id=?`
        notNULLcolumn[j] = req.body.roomid;

        // 값 업데이트
        DB((err,connection)=>{
            if(!err){
                connection.query(updateQuery, notNULLcolumn, (sqlErr)=>{
                    if (sqlErr){
                        console.log("SQL 내부 에러. query를 확인해 주세요.");
                    } else{
                        console.log("업데이트 완료");
                    }
                    res.redirect('/login');
                    connection.release();
                })
            }       
        });
    }
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