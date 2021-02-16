var express = require("express");
const pool = require("../config/dbconfig");
const { HTTPVersionNotSupported, NotExtended } = require("http-errors");
var router = express.Router();
const session = require("express-session");
const { connect } = require("./board");
const { createConnection } = require("mysql");

// 날짜 포맷
Date.prototype.format = function (f) {
    if (!this.valueOf()) return " ";
    var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
    var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var d = this;
    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear(); // 년 (4자리)
            case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
            case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
            case "dd": return d.getDate().zf(2); // 일 (2자리)
            case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
            case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
            case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
            case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
            case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
            case "mm": return d.getMinutes().zf(2); // 분 (2자리)
            case "ss": return d.getSeconds().zf(2); // 초 (2자리)
            case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
            default: return $1;
        }
    });
};
String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };



// 메인페이지
router.get("/", function (req, res) {
  sess = req.session;
  console.log("메인페이지");
  var sql = "SELECT * FROM user";
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  var uuid = uuidv4();
  pool.getConnection((err, conn) => {
    conn.query(sql, function (err, row) {
      if (err) {
        console.log(sql);
        console.log(err);
      }
      if (row) {
        res.render("index.ejs", {
            title: "메인페이지",
            page: "main/main.ejs",
          row: row,
          sess:sess,
          uuid:uuid
        });
        conn.release();
      }
    });
  });
});
// 회원가입
router.get("/sign", function (req, res) {
    console.log("회원가입");
    res.render("user/sign.ejs", {
      title: "회원가입",
    });
});
// 로그인
router.get("/login/:para", function (req, res) {
    var sess = req.session;
    var para = req.params.para;
    sess.destroy();
    console.log("로그인");
    res.render("user/login.ejs", {
      title: "로그인",
      para:para
    });
});

// 로그아웃 요청
router.get('/logout', function (req, res) {
    var sess = req.session;
    console.log("로그아웃");
    console.log(sess);
    sess.destroy();
    res.redirect('/');
});

// 친구추가 페이지
router.get('/add_friend', function (req, res) {
    var sess = req.session;
    var sql = "select * from user";
    pool.getConnection((err, conn) => {
        conn.query(sql, function(err, row){
            res.render("index.ejs", {
                title: "친구추가",
                page: "main/add_friend.ejs",
                sess:sess,
                row:row
            });
            conn.release();
        })
    })
});

// 방 개설 페이지
router.get('/room_open', function (req, res) {
    var sess = req.session;
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
    var uuid = uuidv4();
    res.render("index.ejs", {
        title: "방 오픈 페이지",
        page: "board/room_open.ejs",
        sess:sess,
        uuid:uuid
    });
});

// 방 상세페이지
router.get('/room/:number', function (req, res) {
    var sess = req.session;
    var number = req.params.number;
    var sql = "select * from room where NUMBER=?"
    var sql2 = "SELECT * FROM software_2020_2.friend where USER=?"
    pool.getConnection((err, conn) => {
        conn.query(sql, [number], function(err, row){
            conn.query(sql2, [sess.user.ID], function(err, row2){
                console.log(row2)
                res.render("index.ejs", {
                    title: "방 상세페이지",
                    page: "board/room.ejs",
                    sess:sess,
                    row:row,
                    row2:row2,
                });
                conn.release();
            })
        })
    })
});

// 방 검색
router.get('/search', function (req, res) {
    var sess = req.session;
    res.render("index.ejs", {
        title: "방 상세페이지",
        page: "board/search.ejs",
        sess:sess,
    });
});

// 방 이동
router.get('/move_room/:code', function (req, res) {
    var sess = req.session;
    var code = req.params.code;
    var sql = "select * from room where ROOM_CODE=?"
    pool.getConnection((err, conn) => {
        conn.query(sql, [code], function(err, row){
            console.log(row);
            res.redirect('/room/' + row[0].NUMBER)
        } )
    })
});

// 방 정보
router.get('/roominfo', function (req, res) {
    var sess = req.session;
    var sql = "select * from room where HOST=?"
    pool.getConnection((err, conn) => {
        conn.query(sql, [sess.user.ID], function(err, row){
            console.log(row.length);
            res.render("index.ejs", {
                title: "방 정보",
                page: "board/room_info.ejs",
                sess:sess,
                row:row
            });
        })
        conn.release();
    })
});
module.exports = router;
