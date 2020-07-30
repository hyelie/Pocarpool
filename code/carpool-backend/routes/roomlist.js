const express = require('express');
const router = express.Router();
var DB = require('../db/initiate').connection;
// 미구현된 부분은 TODO : task의 형식으로 달았다.

// GET /roomlist
// GET /roomlist? 
// depart_place, arrive_place, depart_time, arrive_time 총 4개를 Query로 받을 수 있다. (출발장소, 도착장소, 출발시간, 도착시간)
router.get('/', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('GET /roomlist error:0'));
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
    if (property == ``) {
        var sql = `SELECT * FROM carpooldb.roominfos`
    }
    else {
        var sql = `SELECT * FROM carpooldb.roominfos WHERE ${property}`
    }

    // 2. DB.query로 보내서 출력 가져오기
    DB((err, connection) => {
        if (!err) {
            connection.query(sql, (err, rows, fields) => {
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
router.post('/', (req, res, next) => {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('POST /roomlist error:0'));
    }

    console.log(req.body)
    car_type = req.body.car_type
    depart_place = req.body.depart_place
    arrive_place = req.body.arrive_place
    depart_time = req.body.depart_time
    arrive_time = req.body.arrive_time

    // 시간 검사용 정규표현식
    var regExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    // 오류처리
    if ((car_type != "자가용" && car_type != "택시") || depart_place == undefined || arrive_place == undefined || !regExp.test(depart_time) || !regExp.test(arrive_time)) {
        next(new Error('POST /roomlist error:1'));
    }
    else {
        // 1. MySql query문 만들기
        var property = `'${car_type}','${depart_place}','${arrive_place}','${depart_time}','${arrive_time}'`
        //var property = `'자가용','지곡회관','공학동',NOW(),NOW()` //시간: 2020-07-29 14:10:23 형태를 한다
        var sql = `INSERT INTO roominfos (car_type, depart_place, arrive_place, depart_time, arrive_time,current_headcount, total_headcount, curreunt_carrier_num, total_carrier_num, userId, isConfirm, confirm_time) VALUES(${property},0,4,0,4,0,0,NOW())`;

        // 2. DB.query로 보내서 출력 가져오기
        DB((err1, connection) => {
            if (!err1) {
                connection.query(sql, (err2, rows, fields) => {
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
router.put('/', (req, res) => {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('PUT /roomlist error:0'));
    }
    // UPDATE tablename SET column1 = value1, column2 = value2, ... WHERE condition
    res.send('PUT /roomlist');

    console.log(req.body);
    var regExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    var updateData = [req.body.car_type, req.body.depart_place, req.body.arrive_place, req.body.depart_time, req.body.depart_place, req.body.current_headcount, req.body.total_headcount, eq.body.current_carrier_num, req.body.total_carrier_num, req.body.isConfirm, req.body.isConfirm_time];

    // PUT /roomlist 입력 값 에러 : 2
    if (updateQueryArray.every(undefined) || !regExp.test(updateData[3]) || !regExp.test(updateData[4])) {
        next(new Error('PUT /roomlist error:1'));
    } else {
        // query 생성
        var updateQuery = "UPDATE carpoolDB.roominfos SET";
        var roomCol = ["car_type", "depart_place", "arrive_place", "depart_time", "depart_place", "current_headcount", "current_carrier_num", "total_carrier_num", "isConfirm", "isConfirm_time"];
        var notNULLcolumn = new Array();
        var j = 0;
        for (var i = 0; i < updateData.length; i++) {
            if (updateData[i] != undefined) {
                updateQuery = updateQuery + " " + roomCol[i] + "=?,";
                notNULLcolumn[j] = updateQueryArray[i]; j++;
            }
        }
        updateQuery = updateQuery.slice(0, -1) + `WHERE id=?`
        notNULLcolumn[j] = req.body.id;

        // 값 업데이트
        DB((err, connection) => {
            if(err){
                // TODO : DB에 접근 못 할때
                console.log("PUT /roomlist error : 서버 이용자가 너무 많습니다.")
            }
            if (!err) {
                connection.query(updateQuery, notNULLcolumn, (sqlErr) => {
                    if (sqlErr) {
                        // TODO : sql 내부 에러 처리
                        console.log("PUT /roomlist error : SQL 내부 에러. query를 확인해 주세요.");
                    } else {
                        console.log("업데이트 완료");
                    }
                    res.status(200)
                    res.redirect('/login');
                    connection.release();
                })
            }
        });
    }

    res.end()
});

// DELETE /roomlist
router.delete('/', (req, res) => {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('DELETE /roomlist error:0'));
    }
    // DELETE FROM tablename WHERE condition;
    // 값 삭제
    var deleteQuery = `DELETE FROM carpoolDB.roominfos WHERE id=?`;
    DB((err, connection) => {
        if(err){
            // TODO : DB에 접근 못 할때
            console.log("DELETE /roomlist error : 서버 이용자가 너무 많습니다.")
        }
        if (!err) {
            connection.query(deleteQuery, [req.body.id], (sqlErr) => {
                if (sqlErr) {
                    // TODO : sql 내부 에러 처리
                    console.log("DELETE /roomlist error : SQL 내부 에러. query를 확인해 주세요. 해당하는 방이 없습니다.");
                } else {
                    console.log("삭제 완료");
                }
                res.status(200)
                res.redirect('/login');
                connection.release();
            })
        }
    });

    res.end();
});


// GET /roomlist/userid?id=
router.get('/userid', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('GET /roomlist error:0'));
    }

    // admin이 아닌데 다른 id로 접근하는 경우에는 에러
    if(req.user.isAdmin == 0 && req.query.id != req.user.id){
        // TODO : 접근 오류
        next(new Error('GET /roomlist error:2'));
    } else{
        // userid가 속한 방에 대한 정보 출력, ./db/testquery 파일 참고.
        var belongQuery = `SELECT car_type, depart_place, arrive_place, depart_time, arrive_time, current_headcount, total_headcount, curreunt_carrier_num, total_carrier_num, isConfirm, confirm_time
        FROM roominfos INNER JOIN users_and_rooms_infos ON roominfos.id = users_and_rooms_infos.roomID WHERE users_and_rooms_infos.userid = ?;`
        DB((err, connection) => {
            if(err){
                // TODO : DB에 접근 못 할 때
                console.log("GET /roomlist/userid?id= error : 서버 이용자가 너무 많습니다.")
            }
            if (!err) {
                connection.query(belongQuery, [req.query.id], (err, result) => {
                    if (err) {
                        // TODO : sql 내부 에러 처리
                        console.log("GET /roomlist/userid?id= error : SQL 내부 에러. query를 확인해 주세요.");
                    }
                    console.log("id에 해당하는 사람이 속해있는 방의 정보 출력", result);
                    res.json(result);
                    res.status(200).end()
                })
            }
    })
    }

    res.send('GET /roomlist?');
});

// POST /roomlist/userid
router.post('/userid', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('POST /roomlist/userid error:0'));
    }
    res.send('POST /roomlist/userid');
});
// DELETE /roomlist/userid
router.delete('/userid', (req, res) => {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('POST /roomlist error:0'));
    }
    res.send('DELETE /roomlist/userid');
});

// 오류 처리기
// 0 : TODO : 로그인 에러
router.use((err, req, res, next) => {
    res.json({ message: err.message });
})

module.exports = router;