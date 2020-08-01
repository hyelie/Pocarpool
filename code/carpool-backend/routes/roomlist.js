const express = require('express');
const { connect } = require('./auth');
const { PayloadTooLarge } = require('http-errors');
const router = express.Router();
var pool = require('../db/initiate').pool;
// 미구현된 부분은 TODO : task의 형식으로 달았다.

// GET /roomlist
// GET /roomlist? 
// depart_place, arrive_place, depart_time, arrive_time 총 4개를 Query로 받을 수 있다. (출발장소, 도착장소, 출발시간, 도착시간)
router.get('/', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        console.log("login error")
        next(new Error('GET /roomlist error:0'));
    }
    else {
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
        var element = []
        var property = ``
        property = property + ((req.query.depart_place != undefined) ? `depart_place=?` : ``)
        if (req.query.depart_place != undefined) { element.push(depart_place) }
        property = property + ((property != `` && req.query.arrive_place != undefined) ? ` AND ` : ``) + ((req.query.arrive_place != undefined) ? `arrive_place=?` : ``)
        if (req.query.depart_place != undefined) { element.push(arrive_place) }
        property = property + ((property != `` && req.query.depart_time != undefined) ? ` AND ` : ``) + ((req.query.depart_time != undefined) ? `depart_time=?` : ``)
        if (req.query.depart_place != undefined) { element.push(depart_time) }
        property = property + ((property != `` && req.query.arrive_time != undefined) ? ` AND ` : ``) + ((req.query.arrive_time != undefined) ? `arrive_time=?` : ``)
        if (req.query.depart_place != undefined) { element.push(arrive_time) }


        // 쿼리 완성
        if (property == ``) {
            var sql = `SELECT * FROM carpooldb.roominfos`
        }
        else {
            var sql = `SELECT * FROM carpooldb.roominfos WHERE ${property}`
        }
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query(sql, element, (err, rows, fields) => {
                    if (err) throw err;
                    console.log(rows)

                    res.json(rows) // 3. 사용자에게 json 형식으로 출력하기
                    res.status(200);
                });
            }
            console.log(pool._freeConnections.indexOf(connection));
            connection.release();
            console.log(pool._freeConnections.indexOf(connection));
        });
    }
});

// POST /roomlist
// (필수적으로) 입력 되는 값: car_type, depart_place, arrive_place, depart_time, arrive_time
router.post('/', (req, res, next) => {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('POST /roomlist error:0'));
    }
    else {
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
            //`'${car_type}','${depart_place}','${arrive_place}','${depart_time}','${arrive_time}'` 와 같은 형태를 취한다
            //시간: 2020-07-29 14:10:23 형태를 한다
            var sql = `INSERT INTO carpooldb.roominfos (car_type, depart_place, arrive_place, depart_time, arrive_time,current_headcount, total_headcount, current_carrier_num, total_carrier_num, isConfirm, confirm_time) VALUES(?,?,?,?,?,0,0,0,0,0,NOW())`;

            pool.getConnection(function (err, connection) {
                if (!err1) {
                    connection.query(sql, [car_type, depart_place, arrive_place, depart_time, arrive_time], (err2, rows, fields) => {
                        if (err2) throw err2;
                    });
                }
                console.log(pool._freeConnections.indexOf(connection));
                connection.release();
                console.log(pool._freeConnections.indexOf(connection));
            });
            res.status(200).end();
        }
    }
});

// PUT /roomlist
router.put('/', (req, res, next) => {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('PUT /roomlist error:0'));
    } else {
        // UPDATE tablename SET column1 = value1, column2 = value2, ... WHERE condition
        var regExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        var updateData = [req.body.car_type, req.body.depart_place, req.body.arrive_place, req.body.depart_time, req.body.arrive_time, req.body.current_headcount, req.body.total_headcount, req.body.current_carrier_num, req.body.total_carrier_num, req.body.isConfirm, req.body.confirm_time];
        // PUT /roomlist 입력 값 에러 : 2
        // 모든 값이 undefined이거나
        // depart_time이 defined일 때 정규표현식에서 틀리거나
        // arrive_time이 defined일 때 정규표현식에서 틀리거나
        // isConfirmTime이 defined일 때 정규표현식에서 틀리거나.
        if (updateData.every((value) => { return value == undefined ? 1 : 0; }) || (updateData[3] != undefined && !regExp.test(updateData[3])) || (updateData[4] != undefined && !regExp.test(updateData[4])) || (updateData[10] != undefined && !regExp.test(updateData[10])) || req.body.id == undefined) {
            next(new Error('PUT /roomlist error:1'));
        } else {
            // query 생성
            var updateQuery = "UPDATE carpoolDB.roominfos SET";
            var roomCol = ["car_type", "depart_place", "arrive_place", "depart_time", "arrive_time", "current_headcount", "total_headcount", "current_carrier_num", "total_carrier_num", "isConfirm", "confirm_time"];
            console.log(roomCol, '\n', updateData);
            var notNULLcolumn = new Array();
            var j = 0;
            console.log(updateData.length);
            for (var i = 0; i < updateData.length; i++) {
                if (updateData[i] != undefined) {
                    updateQuery = updateQuery + " " + roomCol[i] + "=?,";
                    notNULLcolumn[j] = updateData[i]; j++;
                }
            }
            updateQuery = updateQuery.slice(0, -1) + ` WHERE id=?`
            notNULLcolumn[j] = req.body.id;
            pool.getConnection(function (err, connection) {
                if (err) {
                    // TODO : DB에 접근 못 할때
                    console.log("PUT /roomlist error : 서버 이용자가 너무 많습니다.");
                    connection.release();
                    next(new Error('PUT /roomlist error:3'));
                } else {
                    connection.query(updateQuery, notNULLcolumn, (sqlErr) => {
                        if (sqlErr) {
                            // TODO : sql 내부 에러 처리
                            connection.release();
                            console.log("PUT /roomlist error : SQL 내부 에러. query를 확인해 주세요.");
                            next(new Error('PUT /roomlist error:4'));
                        } else {
                            console.log("업데이트 완료");
                            res.status(200);
                        }
                    });
                }
                console.log(pool._freeConnections.indexOf(connection));
                connection.release();
                console.log(pool._freeConnections.indexOf(connection));
            });
            res.end();
        }
    }
});

// DELETE /roomlist?roomID=
// pass
router.delete('/', (req, res, next) => {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('DELETE /roomlist error:0'));
    } else {
        // DELETE FROM tablename WHERE condition;
        // 값 삭제
        var deleteQuery = `DELETE FROM carpoolDB.roominfos WHERE id=?; DELETE FROM carpoolDB.users_and_rooms_infos WHERE roomId = ?`;
        pool.getConnection(function (err, connection) {
            if (err) {
                // TODO : DB에 접근 못 할때
                connection.release();
                console.log("DELETE /roomlist error : 서버 이용자가 너무 많습니다.");
                next(new Error('DELETE /roomlist error:3'));
            } else {
                connection.query(deleteQuery, [req.query.roomID, req.query.roomID], (sqlErr) => {
                    if (sqlErr) {
                        // TODO : sql 내부 에러 처리
                        console.log("DELETE /roomlist error : SQL 내부 에러. query를 확인해 주세요. 해당하는 방이 없습니다.");
                        connection.release();
                        next(new Error('DELETE /roomlist error:4'));
                    } else {
                        console.log("삭제 완료");
                        res.status(200);
                    }
                });
            }
            console.log(pool._freeConnections.indexOf(connection));
            connection.release();
            console.log(pool._freeConnections.indexOf(connection));
        });
        res.end();
    }
});

// GET /roomlist/userid?userID=
// pass
router.get('/userid', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('GET /roomlist error:0'));
    } else {
        // admin이 아닌데 다른 id로 접근하는 경우에는 에러
        if (req.user.isAdmin == 0 && req.query.userID != req.user.id) {
            // TODO : 접근 권한 오류
            next(new Error('GET /roomlist error:2'));
        } else {
            // userid가 속한 방에 대한 정보 출력, ./db/testquery 파일 참고.
            var belongQuery = `SELECT roominfos.id, car_type, depart_place, arrive_place, depart_time, arrive_time, current_headcount, total_headcount,
            current_carrier_num, total_carrier_num, isConfirm, confirm_time FROM carpooldb.roominfos INNER JOIN carpooldb.users_and_rooms_infos
            ON roominfos.id = users_and_rooms_infos.roomID WHERE users_and_rooms_infos.userid = ? ORDER BY depart_time ASC;`;

            pool.getConnection(function (err, connection) {
                if (err) {
                    // TODO : DB에 접근 못 할 때
                    console.log("GET /roomlist/userid?id= error : 서버 이용자가 너무 많습니다.");
                    connection.release();
                    next(new Error('GET /roomlist error:3'));
                } else {
                    connection.query(belongQuery, [req.query.userID], (err, result) => {
                        console.log(belongQuery);
                        if (err) {
                            // TODO : sql 내부 에러 처리
                            console.log("GET /roomlist/userid?id= error : SQL 내부 에러. query를 확인해 주세요.");
                            connection.release();
                            next(new Error('GET /roomlist error:4'));
                        } else {
                            console.log("id에 해당하는 사람이 속해있는 방의 정보 출력", result);
                            res.json(result);
                            res.status(200);
                        }
                    });
                }
                console.log(pool._freeConnections.indexOf(connection));
                connection.release();
                console.log(pool._freeConnections.indexOf(connection));
            });
        }
    }
});

// POST /roomlist/userid
// pass
router.post('/userid', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('POST /roomlist/userid error:0'));
    } else {
        // query
        var addUsersRoomQuery = `INSERT INTO carpooldb.users_and_rooms_infos (userID, roomID) SELECT ?, ? FROM dual
                                    WHERE EXISTS (SELECT carpooldb.users.id FROM carpooldb.users WHERE carpooldb.users.id = ? LIMIT 1)
                                            AND EXISTS (SELECT roominfos.id FROM carpooldb.roominfos WHERE roominfos.id = ? LIMIT 1)
                                            AND NOT EXISTS (SELECT * FROM carpooldb.users_and_rooms_infos WHERE userid = ? AND roomid = ? LIMIT 1);`;
        var userID = req.body.userID;
        var roomID = req.body.roomID;
        pool.getConnection(function (err, connection) {
            if (err) {
                // TODO : DB에 접근 못 할 때
                console.log("POST /roomlist/userid error : 서버 이용자가 너무 많습니다.");
                connection.release();
                next(new Error('POST /roomlist/userid error:3'));
            } else {
                connection.query(addUsersRoomQuery, [userID, roomID, userID, roomID, userID, roomID], (err, result) => {
                    if (err) {
                        // TODO : sql 내부 에러 처리
                        console.log("POST /roomlist/userid error : SQL 내부 에러. query를 확인해 주세요.");
                        connection.release();
                        next(new Error('POST /roomlist/userid error:4'));
                    } else {
                        res.status(200);
                    }
                });
            }
            console.log(pool._freeConnections.indexOf(connection));
            connection.release();
            console.log(pool._freeConnections.indexOf(connection));
            res.end();
        });
    }
});

// DELETE /roomlist/userid/:userID/:roomID
// pass
router.delete('/userid/:userID/:roomID', (req, res, next) => {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        next(new Error('DELETE /roomlist/userid error:0'));
    } else {
        if (req.user.isAdmin == 0 && req.params.userID != req.user.id) {
            // TODO : 접근 권한 오류
            next(new Error('DELETE /roomlist/userid/:userID/:roomID error:2'));
        } else {
            var deleteQuery = `DELETE FROM carpooldb.users_and_rooms_infos WHERE userid = ? AND roomid = ?;`;
            pool.getConnection(function (err, connection) {
                if (err) {
                    // TODO : DB에 접근 못 할때
                    console.log("DELETE /roomlist/userid error : 서버 이용자가 너무 많습니다.");
                    connection.release();
                    next(new Error('DELETE /roomlist/userid error:3'));
                } else {
                    connection.query(deleteQuery, [req.params.userID, req.params.roomID], (sqlErr) => {
                        if (sqlErr) {
                            // TODO : sql 내부 에러 처리
                            connection.release();
                            console.log("DELETE /roomlist/userid error : SQL 내부 에러. query를 확인해 주세요.");
                            next(new Error('DELETE /roomlist/userid error:4'));
                        } else {
                            console.log("삭제 완료");
                            res.status(200).end();
                        }
                    });
                }
                console.log(pool._freeConnections.indexOf(connection));
                connection.release();
                console.log(pool._freeConnections.indexOf(connection));
            });
            res.end();
        }
    }
});

// 오류 처리기
// 0 : TODO : 로그인 에러
// 1 : TODO : 입력값 에러
// 2 : TODO : 접근 에러
// 3 : TODO : 동시에 너무 많은 접속이 있을 때
// 4 : TODO : query 에러
router.use((err, req, res, next) => {
    res.json({ message: err.message });
})

module.exports = router;