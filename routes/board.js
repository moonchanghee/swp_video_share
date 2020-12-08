var express = require("express");
const app = express();
const { HTTPVersionNotSupported, InsufficientStorage } = require("http-errors");
var router = express.Router();
const pool = require("../config/dbconfig");
var multer = require("multer");

var _storage = multer.diskStorage({
    destination: function (req, file, cb){
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
      cb(null, file.originalname)
    }
  })
  var upload = multer({storage: _storage})

// 랜덤식별자 생성 (UUID)
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}


// 친구 추가
router.post("/add_friend_post", function(req, res){
    var body = req.body;
    var sess = req.session;
    var sql = "insert into friend(USER, FRIEND) values (?,?)"
    pool.getConnection((err, conn) => {
        for(var i = 0; i < body.add.length ; i++){
            conn.query(sql, [sess.user.ID, body.add[i]], function (err, row) {
            });
        }
        res.redirect("/");
        conn.release();
    });
})

// 방 개설
router.post("/open_room_code", upload.single('userfile'), function(req, res){
    var body = req.body;
    var userfile = req.file.originalname;
    var sess = req.session;
    var sql = "insert into room(HOST, ROOM_CODE, VIDEO_FILE_NAME, TITLE, CONTENT) values (?,?,?,?,?)"
    pool.getConnection((err, conn) => {
        conn.query(sql, [sess.user.ID, body.uuid, userfile, body.title, body.content], function (err, row) {
            res.redirect("/");
            conn.release();
        });
    });
})
module.exports = router;
