var mysql = require('mysql');
const { connect } = require('../app');

var initQuery = {
  checkSchema : `CREATE DATABASE IF NOT EXISTS pocarpool; USE pocarpool;`,
  checkTable : `USE pocarpool; CREATE TABLE IF NOT EXISTS pocarpool.users(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    name              VARCHAR(20) NOT NULL,
    report_num        INT(6)      DEFAULT 0 NOT NULL,
    isAdmin           BOOL        DEFAULT false NOT NULL,
    memberEmail       VARCHAR(50) NOT NULL,
    memberType        VARCHAR(20) NOT NULL,
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
    PRIMARY KEY(roomID, sendTime, sendUserID)
  );
  USE pocarpool;
  DROP EVENT IF EXISTS event_clear_overdue;
  CREATE EVENT IF NOT EXISTS event_clear_overdue
    ON SCHEDULE EVERY 1 DAY
    STARTS '2020-11-16 00:00:00'
    COMMENT "delete overdue room and it's data for once a day"
    DO DELETE m, r, ur FROM pocarpool.roominfos AS r
        INNER JOIN pocarpool.users_and_rooms_infos AS ur ON r.id = ur.roomid
        INNER JOIN pocarpool.messages AS m ON m.roomID = r.id
        WHERE NOW() > DATE_ADD(r.confirm_time, INTERVAL 60 DAY);
  `,
  chatlog_rearrange : `ALTER TABLE chatlogs AUTO_INCREMENT=1; SET @COUNT=0; UPDATE chatlogs SET id = @COUNT:=@COUNT+1;`
}

exports.pool = mysql.createPool({
  host : 'localhost',
  user : 'poapper',
  password : 'djffls><akdrh123',
  multipleStatements : true,
  waitForConnections : true,
  connectionLimit : 1000,
  socketPath: '/var/run/mysqld/mysqld.sock'
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

/* 

INSERT INTO pocarpool.roominfos
(id, car_type, depart_place, arrive_place, depart_time, arrive_time,current_headcount, total_headcount, current_carrier_num, total_carrier_num, isConfirm, confirm_time)
VALUES
(1, "자가용", "1번", "1번", "2020-11-16 03:09:00", "2020-11-16 03:09:00", 1, 1, 1, 1, 1, "2020-11-16 03:09:00");

INSERT INTO pocarpool.users_and_rooms_infos
(userID, roomID)
VALUES
(1, 1);

INSERT INTO pocarpool.users_and_rooms_infos
(userID, roomID)
VALUES
(1, 2);

INSERT INTO pocarpool.users_and_rooms_infos
(userID, roomID)
VALUES
(2, 1);

INSERT INTO pocarpool.users_and_rooms_infos
(userID, roomID)
VALUES
(2, 2);

select r.id, r.confirm_time FROM roominfos AS r;

select * from messages;

select * from users_and_rooms_infos;












  SET GLOBAL event_scheduler = ON;
  USE pocarpool;
  DELIMITER $$
    DROP PROCEDURE IF EXISTS event_delete_room;
    CREATE PROCEDURE event_delete_room()
    BEGIN
      SET SQL_SAFE_UPDATES=0;
      DELETE m, r, ur FROM pocarpool.roominfos AS r
        INNER JOIN pocarpool.users_and_rooms_infos AS ur ON r.id = ur.roomid
        INNER JOIN pocarpool.messages AS m ON m.roomID = r.id
        WHERE NOW() > DATE_ADD(r.confirm_time, INTERVAL 3 MONTH);
    END$$
  DELIMITER ;

  CREATE EVENT IF NOT EXISTS event_clear_overdue
    ON SCHEDULE every 1 day
    STARTS '2020-12-01 00:00:00'
    COMMENT '매일 1회 0시에 시작하는 오래된 방 삭제 프로시져'
    DO DELETE m, r, ur FROM pocarpool.roominfos AS r
        INNER JOIN pocarpool.users_and_rooms_infos AS ur ON r.id = ur.roomid
        INNER JOIN pocarpool.messages AS m ON m.roomID = r.id
        WHERE NOW() > DATE_ADD(r.confirm_time, INTERVAL 3 MONTH);
*/