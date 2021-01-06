var express = require('express');
const url = require("url");
var pool = require('../db/initiate').sync_pool;
var request = require('request');

const ssoRedirect = () => {
  return async function(req, res, next) {

    if(req.query.code != null){
        
        // 인증 서버로 보낼 post요청 생성
        var options1 = {
            'method': 'POST',
            'url': 'http://dev-sso.poapper.com:8442/oauth/v1/token',
            'headers': {
            'Authorization': 'Basic cG9hcHBlci1wb2NhcnBvb2wtZGV2OmJyNXpjM1l2cHpBZlp3dFF4OTlkZDd0SDZxOWplaFNma01GbnJmdEQ9PQ==',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({"code":`${req.query.code}`})
        };

        // 토큰 요청 보내기
        request(options1, function (error, response) {
            if (error) throw new Error(error);

            // 토큰 저장 공간
            var Token;

            Token = JSON.parse(response.body)["accessToken"];

            if(Token != null){
                // 토큰 검증 요청 보내기
                var options = {
                    'method': 'GET',
                    'url': 'http://dev-sso.poapper.com:8442/api/v1/member',
                    'headers': {
                    'Authorization': `Bearer ${Token}`
                    }
                };
                
                // 검증 요청
                request(options, async function (error, response) {
                    if (error) throw new Error(error);

                    console.log(response.body);

                    // 유저 정보 저장 변수
                    var user_info = JSON.parse(response.body);

                    var username = user_info["name"];
                    var useremail = user_info["email"];
                    var userid = user_info["id"]; 
                    var usertype = user_info["type"];
                    var userreportnum;
                    var userisAdmin;

                    try{
                        const connection = await pool.getConnection(async conn => conn);

                        console.log("유저정보 확인", username, userid, useremail, usertype);

                        // 이미 db에 있는지 확인 후 db에 넣기
                        var checkuserquery = `SELECT * FROM pocarpool.users WHERE id = ?;`;
                        var [rows] = await connection.query(checkuserquery, [userid]);

                        console.log(rows);

                        // db에 존재하지 않는 경우에만 db에 추가
                        if(rows.length == 0){
                            console.log("not exist\n");
                            var adduserquery = `INSERT INTO pocarpool.users(name, id, memberEmail, memberType, report_num, isAdmin) VALUES (?, ?, ?, ?, ?, ?)`;
                            var [rows2] = await connection.query(adduserquery, [username, userid, useremail , usertype, 0, 0]);
                            console.log("등록 완료~");

                            userreportnum = 0;
                            userisAdmin = 0;
                        }
                        else{
                            console.log("exist\n")
                            userreportnum = rows["0"]["report_num"];
                            userisAdmin = rows["0"]["isAdmin"];
                        }

                        connection.release();

                    } catch(err){
                        console.log('DB Error');
		                return res.redirect(`/`);
                    }

                    console.log("temp : ", userreportnum, userisAdmin);
                
                    // 세션을 통한 로그인
                    if(req.session.user){ // 이미 로그인 되어있는경우
                        console.log("이미 로그인 되어있음. (이럴 수 있나?)");
                    }
                    else{
                        console.log("세션으로 로그인 완료");
                        
                        req.session.user = {
                            id : userid,
                            name : username,
                            email : useremail,
                            type : usertype,
                            report_num : userreportnum,
                            isAdmin : userisAdmin
                        }
                    }

                    return res.status(300).redirect(`/auth/login_success`);
                });
            }
            else{
                return next();
            }
        });
    }
    else{
        return next();
    }
  };
}

module.exports = ssoRedirect;
