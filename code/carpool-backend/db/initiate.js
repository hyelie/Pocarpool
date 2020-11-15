var mysql = require('mysql');
const { connect } = require('../app');

// users table의 memberID, memberPW는 임시 값.
var initQuery = {
  checkSchema : `CREATE DATABASE IF NOT EXISTS pocarpool; USE pocarpool;`,
  checkTable : `USE pocarpool; CREATE TABLE IF NOT EXISTS pocarpool.users(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    name              VARCHAR(20) NOT NULL,
    report_num        INT(6)      DEFAULT 0 NOT NULL,
    isAdmin           BOOL        DEFAULT false NOT NULL,
    memberID          VARCHAR(20) NOT NULL UNIQUE,
    memberPW          VARCHAR(20) NOT NULL,
    PRIMARY KEY(id)
  );  CREATE TABLE IF NOT EXISTS pocarpool.roominfos(
    id                    INT(11)     NOT NULL AUTO_INCREMENT,
    car_type              VARCHAR(3)  NOT NULL,
    depart_place          VARCHAR(50) NOT NULL,
    arrive_place          VARCHAR(50) NOT NULL,
    depart_time           DATETIME    NOT NULL,
    arrive_time           DATETIME    NOT NULL,
    current_headcount     INT(2)      NOT NULL,
    total_headcount       INT(2)      NOT NULL,
    current_carrier_num   INT(2)      NOT NULL,
    total_carrier_num     INT(2)      NOT NULL,
    isConfirm             BOOL        NOT NULL,
    confirm_time          DATETIME    NOT NULL,
    PRIMARY KEY(id)
  );  CREATE TABLE IF NOT EXISTS users_and_rooms_infos(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    userID            INT(11)     NOT NULL,
    roomID            INT(11)     NOT NULL,
    PRIMARY KEY(id)
  );  CREATE TABLE IF NOT EXISTS chatlogs(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    reportID          INT(11)     NOT NULL,
    chat_content      TEXT        NOT NULL,
    PRIMARY KEY(id)
  );  CREATE TABLE IF NOT EXISTS reports(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    reportUserID      INT(11)     NOT NULL,
    accuseUserID      INT(11)     NOT NULL,
    roomID            INT(11)     NOT NULL,
    reportReason      TEXT        NOT NULL,
    isWorkDone        BOOL        NOT NULL DEFAULT false,
    reportTime        DATETIME    NOT NULL,
    PRIMARY KEY(id)
  );  CREATE TABLE IF NOT EXISTS messages(
    roomID            INT(11)     NOT NULL,
    sendTime          DATETIME    NOT NULL,
    sendUserID        INT(11)     NOT NULL,
    chat_content      TEXT        NOT NULL,
    PRIMARY KEY(roomID, sendTime)
  );
  SET GLOBAL event_scheduler = ON;
  DELEMITER $$
    DROP PROCEDURE IF EXISTS event_delete_room$$
    CREATE PROCEDURE event_delete_room()
      BEGIN
        DECLARE i INT DEFAULT (SELECT IFNULL(pocarpool.roominfos.id, -1) FROM pocarpool.roominfos WHERE pocarpool.roominfos.confirm_time > DATE_ADD(pocarpool.roominfos.confirm_time, INTERVAL 3 MONTH) LIMIT 1);
        SET SQL_SAFE_UPDATES=0;
        while(i != -1) DO
          DELETE FROM pocarpool.users_and_rooms_infos WHERE id = i;
          DELETE FROM pocarpool.messages WHERE roomID = i;
          DELETE FROM pocarpool.roominfos WHERE id=i;
          SET i = SELECT IFNULL(pocarpool.roominfos.roomID, -1) FROM pocarpool.roominfos WHERE pocarpool.roominfos.confirm_time > DATE_ADD(pocarpool.roominfos.confirm_time, INTERVAL 3 MONTH) LIMIT 1;
        END WHILE
      END $$
    DELEMITER $$

  CREATE EVENT event_delete_room
    ON SCHEDULE every 1 day
    STARTS '2020-12-01 00:00:00'
    COMMENT '매일 1회 0시에 시작하는 오래된 방 삭제 프로시져'
    DO event_delete_room()
  `,
  chatlog_rearrange : `ALTER TABLE chatlogs AUTO_INCREMENT=1; SET @COUNT=0; UPDATE chatlogs SET id = @COUNT:=@COUNT+1;`
}

exports.pool = mysql.createPool({
  //host : 'pocarpool.poapper.com',
  //user : 'poapper',
  //password : 'djffls><akdrh123',
  host : 'localhost',
  user : 'root',
  multipleStatements : true,
  waitForConnections : true,
  connectionLimit : 1000,
  //socketPath: '/var/run/mysqld/mysqld.sock'
});  

exports.checkQuery = {
  checkDBs : `SHOW DATABASES;`,
  checkTables : `USE pocarpool; SHOW TABLES;`,
};

exports.exeQuery = {
  initMysql: function (pool) {
    console.log("pool에서 Schema 여부를 확인 후 pocarpool 생성");

    pool.getConnection(function (err, connection1) {
      if(err){
        console.log("err 발생!", err);
      }
      connection1.query(initQuery.checkSchema, (error1) => {
        if (error1) throw error1;
        console.log("pocarpool 생성 완료\npocarpool에서 Table 여부를 확인한 후 tables 생성");
        pool.getConnection(function (err2, connection2) {
          connection2.query(initQuery.checkTable, (error2) => {
            if (error2) throw error2;
            console.log("tables 생성 완료");

            console.log(pool._freeConnections.indexOf(connection2));
            connection2.release();
            console.log(pool._freeConnections.indexOf(connection2));
          });
        });
        console.log(pool._freeConnections.indexOf(connection1));
        connection1.release();
        console.log(pool._freeConnections.indexOf(connection1));
      });
    });

  }
}