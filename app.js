var createError = require('http-errors');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var room = ['room1','room2' , 'room3' , 'choiceroom']
var roomnum;
var names = [];
var name;


io.on('connection' , function(socket){  
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
    
socket.on('choice' , function(num){
  socket.join(num)
});

    socket.on('roomnum' , function(num){
      roomnum = room[num];
    });  

    socket.on('name' , function(name){
    socket.join(roomnum , function(){
      io.to(roomnum).emit('joinroom' , roomnum  , name);
    });
    
socket.on('leaveroom' , function(num){
socket.leave(room[num] , function(){
  io.to(room[num]).emit('leaveroom' , name);
});
});

socket.on('sendmsg' , function(a,b ,num ){ 
  console.log( "이름:" + a + " 메시지 :" +b);
  var msg = "이름:" + a + " 메시지 :" +b;
  io.to(room[num]).emit('msg' , msg  , name);
});
});
});


http.listen(3000, function(){ 
	console.log('server on..');
});