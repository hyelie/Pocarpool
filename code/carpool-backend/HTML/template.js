exports.template = {
    register : `
    <!doctype html>
    <html>
    <form name="RegisterDatas" method="post" action="./register_process">
        <p> 회원가입 창입니다. </p>
        <p> - 이름을 입력해 주세요.</p>
        <p><input type="text" name="name" placeholder="이름"></p>
        <p> - 아이디를 입력해 주세요.</p>
        <p><input type="text" name="id" placeholder="ID"></p>
        <p> - 비밀번호를 입력해 주세요.</p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p><input type="submit"></p>
    </form>
    </html>`,
    login : `
    <!doctype html>
    <html>
    <form name="LoginDatas" method="post" action="./login">
        <p> 로그인 창입니다. </p>
        <p> - 아이디를 입력해 주세요.</p>
        <p><input type="text" name="id" placeholder="ID"></p>
        <p> - 비밀번호를 입력해 주세요.</p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p><input type="submit"></p>
    </form>
    </html>`,
    home : `
    <html>
    <p> <a href="/login">Login</a> <a href="/register">Register</a> <p>
    </html>`
}