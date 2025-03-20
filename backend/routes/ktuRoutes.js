var express = require('express');
var router = express.Router();
const verifyTokenAndRole = require('../middleware/verifyTokenAndRole');
const {getPegawaiDataAll, getPermintaanAllAggree,getRemainingLeave} = require('../controllers/pegawai.controller');
const {updateStatus,getEmployeesOnLeave,countPendingLeaveRequests,countEmployeesOnLeave} = require('../controllers/pimpinan.controller');
const { updateStatusKtu,getAllPegawaiWithLeaveData,getRekapanData} = require('../controllers/ktu.controller');


router.get('/dashboard',verifyTokenAndRole('ktu'),countPendingLeaveRequests,
countEmployeesOnLeave, (req, res, next) => {
    res.render('ktu_dashboard', { title: 'Dashboard' ,
        user: req.pegawai, 
        pegawais: req.pegawais,
        leaveRequests: req.leaveRequests || [],
        employeesOnLeave: req.employeesOnLeave || [],
        pendingCount: req.pendingCount,
        employeeOnLeaveCount: req.employeeOnLeaveCount
    });
});

router.get ('/datapegawai',verifyTokenAndRole('ktu'), getAllPegawaiWithLeaveData,
  (req, res) => {
    res.render("ktu_datapegawai", {
      title: "Data Pegawai",
      pegawais: req.pegawaiWithLeave || []
    });
  });

router.get ('/pembatalan',verifyTokenAndRole('ktu'), getPegawaiDataAll,getPermintaanAllAggree, (req, res, next) => {
    res.render('ktu_pembatalan', { title: 'Pembatalan' ,leaveRequests: req.leaveRequests || []});
});

router.get ('/rekapan',verifyTokenAndRole('ktu'),getRekapanData, (req, res, next) => {
    res.render('ktu_rekapan', { title: 'Rekapan', rekapan: req.rekapan || []});
});
router.get ('/tambahpegawai',verifyTokenAndRole('ktu'), (req, res, next) => {
    res.render('ktu_tambah_pegawai', { title: 'Tambah Pegawai' });
});

router.put('/cancel/:id', verifyTokenAndRole('ktu'), updateStatusKtu);

// router.delete(
//     "/data-pegawai/:id",
//     verifyTokenAndRole("ktu"),
//     deletePegawai
// );


module.exports = router;