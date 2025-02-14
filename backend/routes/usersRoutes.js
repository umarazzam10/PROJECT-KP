var express = require('express');
var router = express.Router();
const verifyTokenAndRole = require('../middleware/verifyTokenAndRole');
const {applyLeave,getPegawaiData, getPermintaan,cancelLeave,getRemainingLeave} = require('../controllers/pegawai.controller');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('ini adalah halaman user');
// });

router.get('/', verifyTokenAndRole('user'),getPegawaiData,getPermintaan,getRemainingLeave, (req, res) => {
  // res.render('home', { title: 'Home'});
  res.render('home', { 
    title: 'Home',
    user: req.pegawai, 
    remainingLeave: req.remainingLeave,
    leaveRequests: req.leaveRequests || []  // Contoh: jika di-query sebelumnya
  });
});

router.get('/riwayat', verifyTokenAndRole('user'), getPegawaiData,getPermintaan, (req, res) => {
  res.render('riwayat', {
    title: 'Riwayat Cuti',
    user: req.pegawai,
    leaveRequests: req.leaveRequests || []
  });
});

// Route POST untuk mengajukan cuti
router.post('/apply', verifyTokenAndRole('user'), applyLeave);

router.post('/cancel/:id_permintaan', verifyTokenAndRole('user'), cancelLeave);



module.exports = router;
