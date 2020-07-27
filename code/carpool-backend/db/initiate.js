var mysql = require('mysql')

exports.connection = mysql.createConnection({
    host : 'localhost',
    user : 'poapper',
    password : 'poapper',
    multipleStatements : true
})



var initQuery = {
  checkSchema : `CREATE DATABASE IF NOT EXISTS carpoolDB; USE carpoolDB`,
  checkTable : `CREATE TABLE IF NOT EXISTS users(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    name              VARCHAR(20) NOT NULL,
    report_num        INT(6)      DEFAULT 0 NOT NULL,
    isAdmin           BOOL        DEFAULT false NOT NULL,
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
    userId                INT(11)     NOT NULL,
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
    roomId            INT(11)     NOT NULL,
    userId            INT(11)     NOT NULL,
    chat_send_time    DATETIME    NOT NULL,
    chat_content      TEXT        NOT NULL,
    isWorkDone        BOOL        NOT NULL DEFAULT false,
    PRIMARY KEY(id)
  );  CREATE TABLE IF NOT EXISTS reports(
    id                INT(11)     NOT NULL AUTO_INCREMENT,
    reportId          INT(11)     NOT NULL,
    accusedId         INT(11)     NOT NULL,
    roomId            INT(11)     NOT NULL,
    PRIMARY KEY(id)
  );`,
  chatlog_rearrange : `ALTER TABLE chatlogs AUTO_INCREMENT=1; SET @COUNT=0; UPDATE chatlogs SET id = @COUNT:=@COUNT+1;`
}

exports.checkQuery = {
  checkDBs : `SHOW DATABASES`,
  checkTables : `SHOW TABLES`
}

exports.exeQuery = {
  initMysql : function(DB){
    console.log("DB에서 Schema 여부를 확인 후 carpoolDB 생성");
    DB.query(initQuery.checkSchema, (error) => {
      if (error) throw error;
      console.log("carpoolDB 생성 완료\ncarpoolDB에서 Table 여부를 확인한 후 tables 생성");
      DB.query(initQuery.checkTable, (error) => {
        if (error) throw error;
        console.log("tables 생성 완료");
      });
    });
  }
}