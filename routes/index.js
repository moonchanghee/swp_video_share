var express = require('express');
var router = express.Router();
var {Video} = require('../model/video')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   // res.render('mainchat', { title: 'Express' });
//   res.render('mainPage', { title: 'Express' });
// });


router.get('/', function(req, res, next) {
  // res.render('mainchat', { title: 'Express' });
  res.render('mainChat', { title: 'Express' });
})
router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Express' });
});

router.post('/upload', function(req, res, next) {
  console.log("dddddddddddddddddddddddddd")
  console.log(req.body.data)
//   const video = new Video({
//     title: req.body.title,
//     description:req.body.description,
//     filePath:req.body.filePath ,
//     fileName:req.body.filename,   
//     thumbName : req.body.thumbName
// })
// video.save((err, video) => {
//   if(err) return res.status(400).json({ success: false, err })
//   return res.status(200).({
//       success: true 
//   })
// })
  // res.render('upload', { title: 'Express' });
});

router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Express' });
});

module.exports = router;