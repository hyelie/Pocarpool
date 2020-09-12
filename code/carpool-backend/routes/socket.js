
// connection이라는 이벤트가 발생하면 유저 연결이라는 신호를 주고, 아래 2개의 이벤트가 발생하면 callbak해줌.
  // chat message라는 이벤트가 발생하면 io에서 msg를 emit하고
  // disconnect라는 이벤트가 발생하면 유저의 연결을 끊어 줌.

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
        if(user != undefined){
          console.log("방 번호 : ", roomnum, "chat message : ", msg, roomnum);
          io.to(roomnum).emit("chat message", user, msg);
        }
    });
}