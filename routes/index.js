var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('mainchat', { title: 'Express' });
});

router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Express' });
});

module.exports = router;