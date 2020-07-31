var mysql = require('mysql');
const { connect } = require('../app');
const pool = mysql.createPool({
  host : 'localhost',
  user : 'poapper',
  password : 'poapper',
  multipleStatements : true
})

exports.connection = function(callback){
  pool.getConnection(function(err, connection){
    if(!err){
      callback(err, connection);
    }
  });
}

exports.checkQuery = {
  checkDBs : `SHOW DATABASES;`,
  checkTables : `USE carpoolDB; SHOW TABLES;`,
}

exports.exeQuery = {
  initMysql : function(DB){
    console.log("pool에서 Schema 여부를 확인 후 carpoolDB 생성");
    
     DB((err1, connection1)=>{
      connection1.query(initQuery.checkSchema, (error1) =>{
        if (error1) throw error;
        console.log("carpoolDB 생성 완료\ncarpoolDB에서 Table 여부를 확인한 후 tables 생성");
        DB((err2, connection2) => {
          connection2.query(initQuery.checkTable, (error2) => {
            if (error2) throw error2;
            console.log("tables 생성 완료");
          });
          connection2.release();
        });
      });
      connection1.release();
    }); 
  }
}

// users table의 memberID, memberPW는 임시 값.
var initQuery = {
  checkSchema : `CREATE DATABASE IF NOT EXISTS carpoolDB; USE carpoolDB`,
  checkTable : `CREATE TABLE IF NOT EXISTS users(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    name              VARCHAR(20) NOT NULL,
    report_num        INT(6)      DEFAULT 0 NOT NULL,
    isAdmin           BOOL        DEFAULT false NOT NULL,
    memberID          VARCHAR(20) NOT NULL UNIQUE,
    memberPW          VARCHAR(20) NOT NULL,
    PRIMARY KEY(id)
  );  CREATE TABLE IF NOT EXISTS roominfos(
    id                    INT(11)     NOT NULL AUTO_INCREMENT,
    car_type              VARCHAR(3)  NOT NULL,
    depart_place          VARCHAR(50) NOT NULL,
    arrive_place          VARCHAR(50) NOT NULL,
    depart_time           DATETIME    NOT NULL,
    arrive_time           DATETIME    NOT NULL,
    current_headcount     INT(2)      NOT NULL,
    total_headcount       INT(2)      NOT NULL,
    curreunt_carrier_num  INT(2)      NOT NULL,
    total_carrier_num     INT(2)      NOT NULL,
    isConfirm             BOOL        NOT NULL,
    confirm_time          DATETIME    NOT NULL,
    PRIMARY KEY(id)
  );  CREATE TABLE IF NOT EXISTS users_and_rooms_infos(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    userId            INT(11)     NOT NULL,
    roomId            INT(11)     NOT NULL,
    PRIMARY KEY(id)
  );  CREATE TABLE IF NOT EXISTS chatlogs(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    reportID          INT(11)     NOT NULL,
    chat_content      TEXT        NOT NULL,
    PRIMARY KEY(id)
  );  CREATE TABLE IF NOT EXISTS reports(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    reportUserId      INT(11)     NOT NULL,
    accuseUserId      INT(11)     NOT NULL,
    roomId            INT(11)     NOT NULL,
    reportReason      TEXT        NOT NULL,
    isWorkDone        BOOL        NOT NULL DEFAULT false,
    reportTime        DATETIME    NOT NULL,
    PRIMARY KEY(id)
  );`,
  chatlog_rearrange : `ALTER TABLE chatlogs AUTO_INCREMENT=1; SET @COUNT=0; UPDATE chatlogs SET id = @COUNT:=@COUNT+1;`
}