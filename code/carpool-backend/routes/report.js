const express = require('express');
const { route } = require('.');
var pool = require('../db/initiate').pool;
const router = express.Router();
// 미구현된 부분은 TODO : task의 형식으로 달았다.

// POST /report
router.post('/', function (req, res, next) {
    console.log(`sesseion : ${req.session.user}, isAdmin : %d, id : %d`, req.session.user.isAdmin, req.session.user.id);
    // TODO : 로그인 에러
    if (req.session.user == undefined) {
        console.log("login error")
        next(new Error('POST /report error:0'));
    } else if (req.session.user.isAdmin == 0) {
        // TODO : 접근 권한 오류
        next(new Error('POST /report error:2'));
    } else {
        var reportTime = req.body.reportTime;
        var regExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!regExp.test(reportTime)) {
            next(new Error('POST /report error:1'));
        } else{
            var createReportQuery = `INSERT INTO pocarpool.reports (reportUserID, accuseUserID, roomID, reportReason, reportTime) SELECT ?, ?, ?, ?, ? FROM dual WHERE
                                        NOT EXISTS (SELECT * FROM pocarpool.reports WHERE reports.reportUserID=? AND reports.accuseUserID=?)
                                        AND EXISTS (SELECT users.id FROM pocarpool.users WHERE users.id = ? LIMIT 1)
                                        AND EXISTS (SELECT users.id FROM pocarpool.users WHERE users.id = ? LIMIT 1)
                                        AND EXISTS (SELECT roominfos.id FROM pocarpool.roominfos WHERE roominfos.id = ? LIMIT 1);
                                    INSERT INTO pocarpool.chatlogs (reportID, chat_content) SELECT LAST_INSERT_ID(), ? FROM dual
                                        WHERE EXISTS(SELECT * FROM pocarpool.reports WHERE reports.reportUserID=? AND reports.accuseUserID=? AND reports.roomID = ? LIMIT 1);
                                    UPDATE pocarpool.users SET report_num = report_num+1 WHERE id = ?;`
            var QueryVariable = [req.body.reportUserID, req.body.accuseUserID, req.body.roomID, req.body.reportReason, reportTime, req.body.reportUserID, req.body.accuseUserID, req.body.reportUserID, req.body.accuseUserID, req.body.roomID, req.body.chatlogs, req.body.reportUserID, req.body.accuseUserID, req.body.roomID, req.body.accuseUserID];
            pool.getConnection(function (err, connection) {
                if (err) {
                    // TODO : DB에 접근 못 할때
                    console.log("POST /report?id= error : 서버 이용자가 너무 많습니다.");
                    next(new Error('POST /report?id= error:3'));
                } else {
                    console.log(createReportQuery, QueryVariable);
                    connection.query(createReportQuery, QueryVariable, (sqlErr, result) => {
                        if (sqlErr) {
                            // TODO : sql 내부 에러 처리
                            console.log("POST /report error : SQL 내부 에러. query를 확인해 주세요.");
                            res.status(400);
                        } else {
                            res.status(200);
                        }
                    })
                }
                console.log(pool._freeConnections.indexOf(connection));
                connection.release();
                console.log(pool._freeConnections.indexOf(connection));
            });
        }
        res.end();
    }
});

// GET /report
// GET /report?id=
// GET /report?page=
router.get('/', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.session.user == undefined) {
        console.log("login error")
        next(new Error('GET /report error:0'));
    } else if (req.session.user.isAdmin == 0) {
        // TODO : 접근 권한 오류
        next(new Error('GET /report error:2'));
    } else {
        var getQuery, variable;
        if(req.query.id == undefined){
            // 목록 출력
            getQuery = `SELECT reports.id, reports.roomID, reports.reportUserID, reports.accuseUserID, users.name AS accuseName,  reports.reportReason, reports.isWorkDone, reports.reportTime
                            FROM pocarpool.reports INNER JOIN pocarpool.users ON reports.accuseUserID = users.id
                            ORDER BY reportTime asc LIMIT ?, 20;`;
            variable = (req.query.page-1) * 20;
        } else{
            // reportUserID에 해당하는 신고 세부 내용(채팅)
            getQuery = `SELECT reports.id, reports.roomID, reports.reportUserID, reports.accuseUserID, users.name AS accuseName,  reports.reportReason, reports.isWorkDone, reports.reportTime, chatlogs.chat_content
                            FROM pocarpool.reports
                                INNER JOIN pocarpool.users ON reports.accuseUserID = users.id
                                INNER JOIN pocarpool.chatlogs ON chatlogs.reportID = reports.id
                                WHERE reports.id = ?;`
            variable = req.query.id;
        }
        pool.getConnection(function (err, connection) {
            if (err) {
                // TODO : DB에 접근 못 할때
                console.log("GET /report error : 서버 이용자가 너무 많습니다.");
                next(new Error('GET /report error:3'));
            } else {
                console.log(getQuery, variable);
                connection.query(getQuery, [variable], (sqlErr, result) => {
                    if (sqlErr) {
                        // TODO : sql 내부 에러 처리
                        console.log("GET /report error : SQL 내부 에러. query를 확인해 주세요.");
                        res.status(400);
                    } else {
                        res.json(result);
                        res.status(200);
                    }
                })
            }
            console.log(pool._freeConnections.indexOf(connection));
            connection.release();
            console.log(pool._freeConnections.indexOf(connection));
        });
    }
});

// PUT /report?id=
router.put('/', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.session.user == undefined) {
        console.log("login error")
        next(new Error('PUT /report error:0'));
    } else if (req.session.user.isAdmin == 0) {
        // TODO : 접근 권한 오류
        next(new Error('PUT /report error:2'));
    } else {
        // reportid에 해당하는 신고 세부 내용(채팅)
        var ReportUpdateQuery = `UPDATE pocarpool.reports SET isWorkDone = 1 WHERE id = ?;`;
        pool.getConnection(function (err, connection) {
            if (err) {
                // TODO : DB에 접근 못 할때
                console.log("PUT /report?id= error : 서버 이용자가 너무 많습니다.");
                next(new Error('PUT /report?id= error:3'));
            } else {
                connection.query(ReportUpdateQuery, [req.query.id], (sqlErr, result) => {
                    if (sqlErr) {
                        // TODO : sql 내부 에러 처리
                        console.log("PUT /report error : SQL 내부 에러. query를 확인해 주세요.");
                        res.status(400);
                    } else {
                        res.status(200);
                    }
                })
            }
            console.log(pool._freeConnections.indexOf(connection));
            connection.release();
            console.log(pool._freeConnections.indexOf(connection));
        });
        res.end();
    }
});

// DELETE /report?id=
router.delete('/', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.session.user == undefined) {
        console.log("login error")
        next(new Error('DELETE /report error:0'));
    } else if (req.session.user.isAdmin == 0) {
        // TODO : 접근 권한 오류
        next(new Error('DELETE /report error:2'));
    } else {
        var ReportDeleteQuery = `DELETE FROM pocarpool.reports WHERE id=?; DELETE FROM pocarpool.chatlogs WHERE reportID=?;`;
        pool.getConnection(function (err, connection) {
            if (err) {
                // TODO : DB에 접근 못 할때
                console.log("DELETE /report?id= error : 서버 이용자가 너무 많습니다.");
                next(new Error('DELETE /report?id= error:3'));
            } else {
                connection.query(ReportDeleteQuery, [req.query.id, req.query.id], (sqlErr, result) => {
                    if (sqlErr) {
                        // TODO : sql 내부 에러 처리
                        console.log("DELETE /report error : SQL 내부 에러. query를 확인해 주세요.");
                        res.status(400);
                    } else {
                        res.status(200);
                    }
                })
            }
            console.log(pool._freeConnections.indexOf(connection));
            connection.release();
            console.log(pool._freeConnections.indexOf(connection));
        });
        res.end();
    }
});

// 오류 처리기
// 0 : TODO : 로그인 에러
// 1 : TODO : 입력값 에러
// 2 : TODO : 접근 에러
// 3 : TODO : 동시에 너무 많은 접속이 있을 때
router.use((err, req, res, next) => {
    res.json({ message: err.message });
})

module.exports = router;