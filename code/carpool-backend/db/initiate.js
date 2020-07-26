var mysql = requires('mysql')
var DB = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'a23752666'
})

// schema 없으면 schema 생성
CREATE DATABASE IF NOT EXISTS carpoolDB;

// 해당 db 사용
USE carpoolDB;

// table 없으면 table 생성


/* // * users
CREATE TABLE IF NOT EXISTS users(
  id                INT(11)     NOT NULL AUTO_INCREMENT,
  name              VARCHAR(20) NOT NULL,
  report_num        INT(6)      DEFAULT 0 NOT NULL,
  isAdmin           BOOL        DEFAULT false NOT NULL,
  PRIMARY KEY(id)
);

// * roominfos
CREATE TABLE IF NOT EXISTS users(
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
);

// * roomuserinfo : 사용자 id, 채팅방 id가 들어있는 table.
CREATE TABLE IF NOT EXISTS roomuserinfo(
  id                INT(11)     NOT NULL AUTO_INCREMENT,
  userId            INT(11)     NOT NULL,
  roomId            INT(11)     NOT NULL,
  PRIMARY KEY(id)
);

// * chatlog : 채팅방 id, 발화자 id, 말한 시간, 말한 내용, 처리 여부가 기재되어 있는 table. 
  // 전체 chaglog가 필요한가? chaglog는 local DB에 저장하는 것이 맞는 것 같다.
  // 일단 그래도 신고가 들어온 방의 채팅은 불러와야 할 것이다.
  // 그래서 이 table에는 처리되지 않은 채팅 log를 local에서 불러와 넣어둔다.
CREATE TABLE IF NOT EXISTS chaglog(
  roomId            INT(11)     NOT NULL,
  userId            INT(11)     NOT NULL,
  chat_send_time    DATETIME    NOT NULL,
  chat_content      EXT         NOT NULL,
  isWorkDone        BOOL        DEFAULT false
);

// * report : 신고자 id, 피신고자 id, 방 id가 기재되어 있는 table
CREATE TABLE IF NOT EXISTS report(
  id                INT(11)     NOT NULL AUTO_INCREMENT,
  reportId          INT(11)     NOT NULL,
  accusedId         INT(11)     NOT NULL,
  roomId            INT(11)     NOT NULL,
  PRIMARY KEY(id)
); */



/*

사용자 추가
mysql> create user '사용자'@'localhost(또는 %)' identified by '비밀번호';

사용자 권한 추가
mysql> grant select on DB이름.테이블명 to '사용자'@'localhost';
mysql> grant update(컬럼1, 컬럼2) on DB이름.테이블명 to '사용자'@'localhost';
  // 사용자별로 보거나 수정할 수 있는 DB가 다르기 때문에 설정해 주어야 한다.

사용자의 권한 삭제
mysql> show grants for '사용자명'@'localhost';

*/


/*

auto increment로 지정한 primary key id값은 data를 삭제해도 자동으로 재정렬되지 않는다. 재정렬 하는 방법을 알아보자.

CREATE TABLE IF NOT EXISTS temp(
  id INT(10) NOT NULL AUTO_INCREMENT,
  text TEXT NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO temp(text) VALUES ("1번");
INSERT INTO temp(text) VALUES ("2번");
INSERT INTO temp(text) VALUES ("3번");
INSERT INTO temp(text) VALUES ("4번");
INSERT INTO temp(text) VALUES ("5번");
INSERT INTO temp(text) VALUES ("6번");
INSERT INTO temp(text) VALUES ("7번");
INSERT INTO temp(text) VALUES ("8번");

SELECT * FROM temp;

DELETE FROM temp WHERE id=5;

SELECT * FROM temp;

INSERT INTO temp(text) VALUES ("9번");
INSERT INTO temp(text) VALUES ("10번");

SELECT * FROM temp;

ALTER TABLE temp AUTO_INCREMENT=1;
SET @COUNT=0;
UPDATE temp SET id = @COUNT:=@COUNT+1;

SELECT * FROM temp;
*/