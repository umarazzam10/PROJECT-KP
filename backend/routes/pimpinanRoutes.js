var express = require('express');
var router = express.Router();
const verifyTokenAndRole = require('../middleware/verifyTokenAndRole');
const {getPegawaiDataAll, getPermintaanAll,getRemainingLeave} = require('../controllers/pegawai.controller');
const {updateStatus,getEmployeesOnLeave,countPendingLeaveRequests,countEmployeesOnLeave} = require('../controllers/pimpinan.controller');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('ini adalah halaman user');
// });


router.get(
    '/dashboard',
    verifyTokenAndRole('pimpinan'),
    getPegawaiDataAll,
    countPendingLeaveRequests,
    countEmployeesOnLeave,
    (req, res, next) => {
      res.render('dashboardPimpinan', { 
        title: 'Dashboard', 
        user: req.pegawai, 
        pegawais: req.pegawais,
        leaveRequests: req.leaveRequests || [],
        employeesOnLeave: req.employeesOnLeave || [],
        pendingCount: req.pendingCount,
        employeeOnLeaveCount: req.employeeOnLeaveCount
      });
    }
  );
router.get(
    '/permintaan',
    verifyTokenAndRole('pimpinan'),
    getPegawaiDataAll,getPermintaanAll,
    (req, res, next) => {
      res.render('permintaanCuti', { 
        title: 'Permintaan',
        pegawais: req.pegawais, // kirim array pegawai dengan nama yang lebih tepat
        leaveRequests: req.leaveRequests || [] // pastikan ada middleware untuk leaveRequests jika diperlukan
      });
    }
  );
  
  router.put('/update/:id', verifyTokenAndRole('pimpinan'), updateStatus);

module.exports = router;