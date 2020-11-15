
// connection이라는 이벤트가 발생하면 유저 연결이라는 신호를 주고, 아래 2개의 이벤트가 발생하면 callbak해줌.
  // chat message라는 이벤트가 발생하면 io에서 msg를 emit하고
  // disconnect라는 이벤트가 발생하면 유저의 연결을 끊어 줌.
var pool = require('../db/initiate').pool;

exports.chatActivity = (socket,io) => {
    console.log("a user connected");
    socket.on('disconnect', () => {
      console.log("a user disconnected");
    });
  
    // 1. joinRoom
    socket.on('joinRoom', (roomnum, user) => {
        socket.join(roomnum, () => {
            console.log(user + ' join room' + roomnum);
            // io에서 room에게 joinRoom이라는 이벤트를 보낸다.
            io.to(roomnum).emit('joinRoom', roomnum, user);
        });
        console.log("채팅방에 user 추가 완료");
    });
  
    // 2. leaveRoom
    socket.on('leaveRoom', (roomnum, user) => {
        socket.leave(roomnum, () => {
            console.log(' leave room ' + roomnum);
            // io에서 room에게 leaveRoom이라는 이벤트를 보낸다.
            io.to(roomnum).emit('leaveRoom', roomnum, user);
        });
    });

  // 3. chat message
  // 인자는 방 번호인 roomnum, 사용자인 user, 메시지 내용인 msg.
  socket.on('chat message', (roomnum, user, msg) => {
    // 마찬가지로 user가 define되어있을 때만 socket이 작동함.
    if (user != undefined) {
      //console.log("방 번호 : ", roomnum, "username : ", user, "chat message : ", msg, roomnum);
      io.to(roomnum).emit("chat message", user, msg);

      // DB에 채팅내용 추가.

      var ctime = new Date();
      var roomID = roomnum;
      console.log("roomnum : ", roomnum, " and type : ", typeof(roomnum));
      var sentTime = getFormatDate(ctime);
      // YYYY-MM-DD HH:MM:SS
      // TODO : 일단은 송신 시간을 넣어뒀음 근데 폰에서 보낸 시간이랑 서버에서 저장한 시간 다를 수 있기 때문에 socket.on chat message에서 time 보내는 편이 좋을 듯.
      var sendUserID = user;
      var chat_content = msg;

      // 먼저 서버의 db에 입력받은 값을 넣어준다.
      var chatQuery = "INSERT INTO pocarpool.messages (roomID, sendTime, sendUserID, chat_content) VALUES(?,?,?,?);";
      pool.getConnection(function (err, connection) {
        if (err) {
          // TODO : DB에 접근 못 할 때
          console.log("POST /chat error : 서버 이용자가 너무 많습니다.");
        } else {
          
          //console.log("query : ", chatQuery, "each value : ", roomID, sentTime, sendUserID, chat_content);
          connection.query(chatQuery, [roomID, sentTime, sendUserID, chat_content], (err) => {
            if (err) {
              // TODO : sql 내부 에러 처리
              //console.log(err);
              console.log("DB에 값 추가 안 됨!");
            } else {
              console.log("DB에 값 추가 완료!");
            }
          });
        }
        connection.release();
      });
    }
  });
}

function getFormatDate(){
  // YYYY-MM-DD HH:MM:SS
  var date = new Date();

  var yyyy = date.getFullYear();
  var mm = (date.getMonth() + 1);
  mm = mm >= 10 ? mm : '0' + mm;
  var dd = date.getDate();
  dd = dd >= 10 ? dd : '0' + dd;
  var hh = date.getHours();
  var mmm = date.getMinutes();
  var ss = date.getSeconds();
  
  return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mmm + ':' + ss;
}