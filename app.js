var express = require("express");
var createError = require("http-errors");
var path = require("path");
var app = express();
var cookieParser = require("cookie-parser");
var session = require("express-session");
var MySQLStore = require('express-mysql-session')(session);
var logger = require("morgan");
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var boardRouter = require("./routes/board");
var pythonShell = require("python-shell");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/")));

app.use(
  session({
    secret: "fdasj#@U!&#%#$",
    resave: false,
    saveUninitialized: true, // 세션이 필요하기전까진 세션을 실행하지 않겠다
  })
);

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/board', boardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var roomnum;
var msg
var roomnum2;
// var ios = require("express-socket.io-session")
// io.use(ios(session,{autoSave:true}))
io.on('connection' , function(socket){  
console.log("연결")
  socket.on('test', function(msg) {
    console.log(msg.msg);
  });

  socket.on('aaaa' , function(e){
  })


  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
    

    socket.on('roomnum' , function(num){
      // console.log(num)
      roomnum = num;
      console.log(roomnum)
      console.log("ddddddddddddddddddddddddd")
      // socket.join(num)
      // console.log(socket.handshake.session.adminId)
    });  
//////////////////////////////////

    socket.on('name' , function(name){
      socket.join(roomnum , function(){
        io.to(roomnum).emit('joinroom' , name);
      });
      io.to(roomnum).emit("sss" , name)

      socket.on('leaveroom' , function(num){
        socket.leave(num , function(){
          // io.to(num).emit('leaveroom' , name);
        });
        io.to(num).emit('leaveroom' , name);
        });
socket.on('sendmsg' , function(b ,num ){ 
  console.log( "메시지 :" +b);
  console.log(num)
  msg =  name + ":" +b;
  io.to(num).emit('msg' , msg  );
});
});

socket.on('name2' , function(name){
  console.log("name : " + name)
  socket.join(roomnum2 , function(){
    io.to(roomnum2).emit('joinroom2' , name);
  });
});

socket.on('roomnum2' , function(num){
  // console.log(num)
  roomnum2 = num;
  console.log(roomnum)
  console.log("ddddddddddddddddddddddddd")
  // socket.join(num)
  // console.log(socket.handshake.session.adminId)
});  


///////////////////////////////////////////////////////

socket.on('sendmsg2' , function(b ,num ){ 
  console.log( "메시지 :" +b);
  console.log(num)
  msg = b;
  io.to(num).emit('msg2' , msg  );
});

// socket.on('testroomnum' , function(num){

//   roomnum2 = num;
//   console.log(roomnum2)

// });  

// socket.on('testname' , function(name){
//   console.log("ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ")
//   console.log(name)

// socket.emit('testtest' , "성공")

//   });


});
// });


http.listen(3000, function(){ 
   console.log('server on..');
});
// module.exports = app;