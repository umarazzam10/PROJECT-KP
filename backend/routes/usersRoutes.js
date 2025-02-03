var express = require('express');
var router = express.Router();
const verifyTokenAndRole = require('../middleware/verifyTokenAndRole');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('ini adalah halaman user');
// });

router.get('/', verifyTokenAndRole('user'), (req, res) => {
  // res.render('home', { title: 'Home'});
  res.render('home', { title: 'Home'});
});

module.exports = router;
