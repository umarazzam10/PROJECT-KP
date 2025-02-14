var express = require('express');
var router = express.Router();
const verifyTokenAndRole = require('../middleware/verifyTokenAndRole');

router.get('/dashboard', verifyTokenAndRole('pimpinan'), function(req, res, next) {
    res.render('dashboardPimpinan', { title: 'Dashboard' });
});


module.exports = router;