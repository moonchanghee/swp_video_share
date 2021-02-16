var express = require("express");
const pool = require("../config/dbconfig");
var router = express.Router();

// 회원가입
router.post("/sign", function (req, res) {
  var body = req.body;
  console.log(req.body);
  var sql = "insert into user  (ID, PWD, NAME) values (?,?,?)";
  if(body.password == body.password2){
      pool.getConnection((err, conn)=> {
        conn.query(sql, [req.body.id, body.password, body.name], 
            function(err, result){
                if(err){
                    console.log(err);
                    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
                    res.write("<script> alert('회원가입에 문제가 있습니다..'); history.back(); </script>");
                    conn.release();
                    return;
                }
                if(result){
                    res.redirect("/");
                    conn.release();
                    return;
                } else {
                }
            })
    })} else {
        console.log(err);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
        res.write("<script> alert('비밀번호가 일치하지 않습니다..'); history.back(); </script>");
        res.redirect('/sign')
    }
});

// 회원 로그인
router.post("/login", function (req, res) {
    var sess = req.session; // 세션값 사용
    var body = req.body;
    pool.getConnection((err, conn) => {
      if (err) throw err;
      var sql = "SELECT * FROM user where ID=? and PWD=?";
      conn.query(sql, [body.id, body.password], (err, row) => {
        conn.release();
        if (err) {
          console.log("로그인 에러");
          console.log(err);
        } else {
          if (row[0] == null) {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
            res.write(
              "<script> alert('아이디와 비밀번호가 일치하지 않습니다..'); history.back(); </script>"
            );
          } else {
            sess.user = row[0];
            res.redirect(body.before_url);
          }
        }
      });
    });
});

//카드 등록
router.post("/card_registration", function (req, res) {
    var sess = req.session; // 세션값 사용
    var body = req.body;
    var card_number = body.number1 + '-' + body.number2 + '-' + body.number3 + '-' +body.number4;
    var card_date = body.date1 + '-' + body.date2;
    console.log(req.body)
    pool.getConnection((err, conn)=> {
        if (err) throw err;
        var sql = "insert into card(USER_ID, CARD_NUMBER, CARD_DATE, CARD_TYPE) values (?,?,?,?)";
        conn.query(sql, [sess.user.USER_ID , card_number, card_date, body.name], (err, row) => {
                if(err){
                    console.log(err);
                    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8;" });
                    res.write("<script> alert('카드 등록에 문제가 있습니다..'); history.back(); </script>");
                    return;
                }
                if(row){
                    res.redirect("/mypage/card");
                    return;
                } else {
                }
            })
    });
});
module.exports = router;