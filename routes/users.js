var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.get('/chat', function(req, res, next) {

//   var rooms = [
//     'room1',
//     'room2',
//     'room3'
//   ];

//   var output = `
//   <a href = "/chat?room=0">1</a>
//   <a href = "/chat?room=1">2</a>
//   <a href = "/chat?room=2">3</a> 
//   <h1>${rooms[req.query.room]}</h1>
//   `

// res.send(output);
// });


module.exports = router;
