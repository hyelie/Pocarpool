const connection = require('../db/initiate').connection;
const initDB = require('../db/initiate').exeQuery;

// www.js 에서 한번만 호출되는 함수이며, initiate.js를 수행시킨다.
exports.init = function(){
    connection.connect();
    initDB.initMysql(connection);
}

// 프로젝트에서 db에 접근할 때는 아래의 함수를 사용하자
// 사용 예시: const DB = require('../db/db_connect')
exports.connected_db = function(){
    return connection
}