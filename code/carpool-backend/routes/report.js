const express = require('express');
const router = express.Router();
var DB = require('../db/initiate').connection;
// 미구현된 부분은 TODO : task의 형식으로 달았다.

// POST /report
router.post('/', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        console.log("login error")
        next(new Error('POST /report error:0'));
    } else if (req.user.isAdmin == 0) {
        // TODO : 접근 권한 오류
        next(new Error('POST /report error:2'));
    } else {
        var reportUserID = req.body.reportUserID;
        var accuseUserID = req.body.accuseUserID;
        var roomID = req.body.roomID;
        var reportReason = req.body.reportReason;
        var reportTime = req.body.reportTime;

        var regExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!regExp.test(reportTime)) {
            next(new Error('POST /report error:1'));
        }
    }
});

// GET /report
// GET /report?id=
router.get('/', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        console.log("login error")
        next(new Error('GET /report error:0'));
    } else if (req.user.isAdmin == 0) {
        // TODO : 접근 권한 오류
        next(new Error('GET /report error:2'));
    } else {
        var getQuery, variable;
        if(req.query.id == undefined){
            // 목록 출력
            var getQuery = `SELECT reports.id, reports.roomID, reports.reportID, reports.accuseID, users.name AS accuseName, users.memberID AS accuseMemberID, reports.reportReason, reports.isWorkDone, reports.reportTime
                            FROM carpooldb.reports INNER JOIN carpooldb.users ON reports.accuseID = users.id
                            ORDER BY reportTime asc LIMIT ?, 20;`;
            var variable = (req.query.page-1) * 20;
        } else{
            // reportid에 해당하는 신고 세부 내용(채팅)
            var getQuery = `SELECT reports.id, reports.roomID, reports.reportUserID, reports.accuseUserID, users.name AS accuseName, users.memberID AS accuseMemberID, reports.reportReason, reports.isWorkDone, reports.reportTime, chatlogs.chat_content
                            FROM carpooldb.reports
                                INNER JOIN carpooldb.users ON reports.accuseUserID = users.id
                                INNER JOIN carpooldb.chatlogs ON chatlogs.reportID = reports.id
                                WHERE reports.id = ?;`
            var variable = req.query.id;
        }
        DB((err, connection) => {
            if (err) {
                // TODO : DB에 접근 못 할때
                console.log("GET /report error : 서버 이용자가 너무 많습니다.");
                next(new Error('GET /report error:3'));
            } else {
                connection.query(getQuery, [variable], (sqlErr) => {
                    if (sqlErr) {
                        // TODO : sql 내부 에러 처리
                        console.log("GET /report error : SQL 내부 에러. query를 확인해 주세요.");
                    } else {
                        res.json(result);
                        res.status(200).end();
                    }
                })
            }
            connection.release();
        });
    }
});

// PUT /report?id=
router.put('/', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        console.log("login error")
        next(new Error('DELETE /report error:0'));
    } else if (req.user.isAdmin == 0) {
        // TODO : 접근 권한 오류
        next(new Error('DELETE /report error:2'));
    } else {
        // reportid에 해당하는 신고 세부 내용(채팅)
        var ReportUpdateQuery = `UPDATE carpooldb.reports SET isWorkDone = 1 WHERE id = ?;`
        DB((err, connection) => {
            if (err) {
                // TODO : DB에 접근 못 할때
                console.log("PUT /report?id= error : 서버 이용자가 너무 많습니다.");
                next(new Error('PUT /report?id= error:3'));
            } else {
                connection.query(ReportUpdateQuery, [req.query.id], (sqlErr) => {
                    if (sqlErr) {
                        // TODO : sql 내부 에러 처리
                        console.log("GET /report error : SQL 내부 에러. query를 확인해 주세요.");
                    } else {
                        res.status(200).end();
                    }
                })
            }
            connection.release();
        });
    }
});

// DELETE /report?id=
router.delete('/', function (req, res, next) {
    // TODO : 로그인 에러
    if (req.user == undefined) {
        console.log("login error")
        next(new Error('DELETE /report error:0'));
    } else if (req.user.isAdmin == 0) {
        // TODO : 접근 권한 오류
        next(new Error('DELETE /report error:2'));
    } else {
        var ReportDeleteQuery = `DELETE FROM carpoolDB.reports WHERE id=?; DELETE FROM carpoolDB.chatlogs WHERE reportID=?;`
        DB((err, connection) => {
            if (err) {
                // TODO : DB에 접근 못 할때
                console.log("DELETE /report?id= error : 서버 이용자가 너무 많습니다.");
                next(new Error('DELETE /report?id= error:3'));
            } else {
                connection.query(ReportDeleteQuery, [req.query.id], (sqlErr) => {
                    if (sqlErr) {
                        // TODO : sql 내부 에러 처리
                        console.log("DELETE /report error : SQL 내부 에러. query를 확인해 주세요.");
                    } else {
                        res.status(200).end();
                    }
                })
            }
            connection.release();
        });
    }
});

