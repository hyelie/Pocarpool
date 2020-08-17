var pool = require('../db/initiate').pool;

// connection이라는 이벤트가 발생하면 유저 연결이라는 신호를 주고, 아래 2개의 이벤트가 발생하면 callbak해줌.
  // chat message라는 이벤트가 발생하면 io에서 msg를 emit하고
  // disconnect라는 이벤트가 발생하면 유저의 연결을 끊어 줌.

exports.chatActivity = (socket) => {
    console.log("a user connected");
    socket.on('disconnect', () => {
      console.log("a user disconnected");
    });
  
    // 1. joinRoom
    // joinROom은 roomnum과 user를 인자로 받음. roomnum은 join하고자 하는 방 번호, user는 로그인된 사람의 정보.
    socket.on("joinRoom", (roomnum, user) => {
      // user가 undefined이면 아무것도 하지 않음.
      // user가 defined이면 DB에서 num에 해당하는 방이 있는지 검사 후 DB에 넣는 시도를 함.
      // users_and_rooms_infos에 추가하는데, DB에 성공적으로 데이터가 들어갔을 때만 socket에서 room join을 해줌.
      if(user != undefined){
          pool.getConnection(function (err1, connection1) {
              if (err1) {
                  // TODO : DB에 접근 못 할때
                  console.log("chat joinroom : 서버 이용자가 너무 많습니다.");
                  connection1.release();
              } else {
                  roomExistQuery = `SELECT id FROM carpooldb.roominfos;`;
                  connection1.query(roomExistQuery, (sqlErr1, result) => {
                      if (sqlErr1) {
                          // TODO : sql 내부 에러 처리
                          connection1.release();
                          console.log("chat joinroom : SQL 내부 에러. query를 확인해 주세요.");
                      } else if (result != undefined){
                          addUserToRoomQuery = `INSERT INTO carpooldb.users_and_rooms_infos (userID, roomID) VALUES (?, ?);`;
                          pool.getConnection(function(err2, connection2){
                              if(err2){
                                  // TODO : DB에 접근 못 할때
                                  console.log("chat joinroom : 서버 이용자가 너무 많습니다.");
                                  connection2.release();
                              } else {
                                  connection2.query(addUserToRoomQuery, [user.id, roomnum], (sqlErr2) => {
                                      if (sqlErr2) {
                                          connection2.release();
                                          console.log("chat joinroom : SQL 내부 에러. query를 확인해 주세요.");
                                      } else {
                                          // 이후 socket에서 해당 room으로 join시켜주고
                                          socket.join(roomnum, () => {
                                              console.log(user.name + ' join room' + roomnum);
                                              // io에서 room에게 joinRoom이라는 이벤트를 보낸다.
                                              app.io.to(roomnum).emit('joinRoom', num, user);
                                          });
                                          console.log("채팅방에 user 추가 완료");
                                      }
                                  });
                              }
                          });
                      } 
                  });
              }
          });
      }
    });
  
    // 2. leaveRoom
    // leaveRoom은 roomnum(방 번호)와 user를 인자로 받음. roomnum은 leave하고자 하는 방 번호, user는 사용자의 정보.
    socket.on("leaveRoom", (roomnum, user) => {
        // user가 defined되어 있을 때만 작동함.
        // DB의 users_and_rooms_infos에서 roomnum과 user.id에 해당하는 정보를 지우는 게 성공할 때만 socket에 leave한다고 말 해줌.
        if(user != undefined){
          pool.getConnection(function(err, connection){
              if(err){
                  console.log("chat leaveroom : 서버 이용자가 너무 많습니다.");
                  connection.release();
              } else {
                  roomLeaveQuery = `DELETE FROM carpooldb.users_and_rooms_infos WHERE roomID = ? AND userID = ?;`;
                  connection.query(roomLeaveQuery, [roomnum, user.id], (sqlErr) => {
                      if (sqlErr) {
                          // TODO : sql 내부 에러 처리
                          connection1.release();
                          console.log("chat joinroom : SQL 내부 에러. query를 확인해 주세요.");
                      } else {
                          // socket에서 누군가가 방을 나갔다고 말해주고
                          socket.leave(roomnum, () => {
                              console.log(name + ' leave room ' + roomnum);
                              // io에서 room에게 leaveRoom이라는 이벤트를 보낸다.
                              app.io.to(roomnum).emit('leaveRoom', num, user);
                          });
                      }
                  });
              }
          });
        }
    });
  
    // 3. chat message
    // 인자는 방 번호인 roomnum, 사용자인 user, 메시지 내용인 msg.
    socket.on('chat message', (roomnum, user, msg) => {
        // 마찬가지로 user가 define되어있을 때만 socket이 작동함.
        if(user.id != undefined){
          console.log("방 번호 : ", roomnum, "chat message : ", msg, roomnum);
          app.io.to(roomnum).emit("chat message", user.name, msg);
        }
    });
}