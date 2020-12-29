var express = require('express');
var router = express.Router();
var template = require('../HTML/template').template;
var pool = require('../db/initiate').pool;

// home
router.get('/', function(req, res, next) {
    
    res.send(template.chat);
    //res.send()
    res.end();
});

// POST /chat/getmsg
// post 방식. req.body에 roomID, sendTime, sendUserID, chat_content가 들어있다.
router.post('/getmsg', function(req, res, next){

    var time = req.body.datetime;
    var userID = req.session.user.userID;
    
    // TODO : 로그인 에러
     if (req.session.user == undefined) {
        next(new Error('POST /chat/getmsg error:0'));
    } else {
        console.log("문제가 뭔자");
            // userid가 속한 방에 대한 정보 출력, ./db/testquery 파일 참고.
            var msgQuery = `SELECT pocarpool.messages.roomID, pocarpool.messages.sendTime, pocarpool.messages.sendUserID, pocarpool.messages.chat_content
                                FROM pocarpool.messages INNER JOIN pocarpool.users_and_rooms_infos
                                ON pocarpool.messages.roomID = pocarpool.users_and_rooms_infos.roomID
                                    WHERE pocarpool.users_and_rooms_infos.userID = ?
                                    AND pocarpool.messages.sendTime > str_to_date(?, '%Y-%m-%d %h:%i:%s');`;
            // 2020-11-16 01:00:33
            pool.getConnection(function (err, connection) {
                if (err) {
                    // TODO : DB에 접근 못 할 때
                    console.log("POST /chat/getmsg error : 서버 이용자가 너무 많습니다.");
                    //connection.release();
                    next(new Error('POST /chat/getmsg error:3'));
                } else {
                    console.log("문제?");
                    connection.query(msgQuery, [userID, time], (err, result) => {
                        //console.log(belongQuery);
                        if (err) {
                            // TODO : sql 내부 에러 처리
                            console.log("POST /chat/getmsg error : SQL 내부 에러. query를 확인해 주세요.");
                            //connection.release();
                            next(new Error('POST /chat/getmsg error:4'));
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