const isLogined = (req, res, next) => {
    // 현재 로그인 되어있는지 확인 한다.
    // 그리고 로그인이 되어있지 않는 경우 인증서버로 이동하여 로그인을 한다.
    // 이후 인증서버에서 redirect되어 session이 만들어지고, 현재 미들웨어가 다시 호출된다.

    // 이후 서버에서 사용할 때 서버 주소로 수정 필요 @@@@@@@@@@@@@@@@@@@@@@@@
    //const redirectUrl = `http://localhost:3000/auth/login_process`;
    const redirectUrl = `http://pocarpool.poapper.com/auth/login_process`;
    //const redirectUrl = `${req.protocol}://${req.headers.host}${req.path}`;
    if (req.session.user == null) {
      return res.redirect(
        `http://dev-sso.poapper.com:8442/oauth/v1/authorize?redirectUri=${redirectUrl}&responseType=code&clientId=poapper-pocarpool-dev`
      );
    }
    next();
  };
  
  module.exports = isLogined;
  