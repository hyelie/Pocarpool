const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var DB = require('../db/initiate').connection;

module.exports = () => {
    // login시 호출되며 done에 있는 user.id가 deserializeUser의 첫 번째 parameter로 들어감.
    passport.serializeUser(function (user, done) {
        console.log("serializeUser 확인", user[0]);
        done(null, user[0].memberID);
    });
    // login 시 어떤 사용자인지를 돌려주는 함수. done에 있는 user가 request.user가 됨.
    passport.deserializeUser(function (id, done) {
        DB((err, connection) => {
            if (!err) {
                var findByID_query = `SELECT * FROM carpoolDB.users WHERE memberID = (?);`
                connection.query(findByID_query, [id], (err, result) => {
                    if (err) {
                        console.log("사용자 정보를  불러올 수 없습니다.");
                    }
                    // result 중에 id로 검사하는 문
                    console.log("deserializeUser", id, result[0]);
                    done(err, result[0]);
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
        passReqToCallback: true
    }, (req, username, password, done) => {
        console.log("localstrategy", username, password);
        DB((err, connection) => {
            if (err) return done(findError);     // DB 에러
            var findByID_query = `SELECT * FROM carpoolDB.users WHERE memberID = (?);`
            connection.query(findByID_query, [username], (err, result) => {
                console.log("localstrategy find result", result[0]);
                // result 내부에서 id로 검사하는 문
                if (result.length == 0) {
                    console.log("존재하지 않는 ID입니다.");
                    return done(null, false, { message: '존재하지 않는 ID입니다.' });
                } else if (result[0].memberPW != password) {
                    console.log("비밀번호가 틀렸습니다.");
                    return done(null, false, { message: '비밀번호가 틀렸습니다.' });
                } else {
                    console.log("성공!");
                    req.user = result[0];
                    return done(null, result);
                }
            });
        });
    }));
}