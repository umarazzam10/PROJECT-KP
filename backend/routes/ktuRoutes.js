var express = require('express');
var router = express.Router();
const verifyTokenAndRole = require('../middleware/verifyTokenAndRole');

router.get('/dashboard',verifyTokenAndRole('ktu'), (req, res, next) => {
    res.render('ktu_dashboard', { title: 'Dashboard' });
});

router.get ('/datapegawai',verifyTokenAndRole('ktu'), (req, res, next) => {
    res.render('ktu_datapegawai', { title: 'Data Pegawai' });
});

router.get ('/pembatalan',verifyTokenAndRole('ktu'), (req, res, next) => {
    res.render('ktu_pembatalan', { title: 'Pembatalan' });
});

router.get ('/rekapan',verifyTokenAndRole('ktu'), (req, res, next) => {
    res.render('ktu_rekapan', { title: 'Rekapan' });
});
router.get ('/tambahpegawai',verifyTokenAndRole('ktu'), (req, res, next) => {
    res.render('ktu_tambah_pegawai', { title: 'Tambah Pegawai' });
});


module.exports = router;