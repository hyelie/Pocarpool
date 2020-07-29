const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var DB = require('../db/initiate').connection;

module.exports = function () {
    // login시 호출되며 done에 있는 user.id가 deserializeUser의 첫 번째 parameter로 들어감.
    passport.serializeUser(function (user, done) {
        console.log("serializeUser", user);
        done(null, user.memberID);
    });

    // login 시 어떤 사용자인지를 돌려주는 함수. done에 있는 user가 request.user가 됨.
    passport.deserializeUser(function (id, done) {
        DB((err, connection) => {
            if (!err) {
                var findByID_query = `SELECT * FROM carpoolDB.users WHERE memberID = (?);`
                connection.query(findByID_query, [id], (err, result) => {
                    if (err) {
                        console.log("로그인 인증 - 사용자 정보를  불러올 수 없습니다.");
                    }
                    console.log("deserializeUser", id, result);
                    done(err, result);
                });
            }
        });
    });

    // 일단은 local 로그인으로 작성, 추후 통합로그인 모듈이 완성되면 로그인 방식 수정 요망.
    // session을 이용했음.
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pwd',
        session: true,
    }, (id, password, done) => {
        DB((err, connection) => {
            if (err) return done(findError);     // DB 에러

            var findByID_query = `SELECT * FROM carpoolDB.users WHERE memberID = (?);`
            connection.query(findByID_query, [id], (err, result) => {
                if(!result) return done(null, false, { message: '존재하지 않는 ID입니다.' });
                else if(result.memberPW != password) done(null, false, {message : '비밀번호가 틀렸습니다.'});
                else return done(null, result);



            });

        });
    }));
};
