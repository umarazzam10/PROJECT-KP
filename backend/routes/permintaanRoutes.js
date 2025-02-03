const express = require("express");
const router = express.Router();
const controller = require("../controllers/permintaan.controller");

router.get('/permintaan',
    controller.getPermintaanCutiList
  );

router.post('/approve/:id',
    controller.approvePermintaanCuti
);

router.post('/reject/:id',
    controller.rejectpermintaanCuti
);

router.post('/pengajuan-cuti', controller.pengajuanCuti);

  module.exports = router;  