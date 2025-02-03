const { Permintaan_Cuti, Pegawai} = require('../models');
const { Op } = require('sequelize');

exports.getPermintaanCutiList = async (req, res, next) => {
  try {
    const { filter } = req.query;
    
    // Build date filter based on "Sebulan terakhir" or other filter options
    const dateFilter = {};
    if (filter === 'sebulan_terakhir') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dateFilter.tanggal_mulai = {
        [Op.gte]: oneMonthAgo
      };
    }

    const { status, search } = req.query;
    
    // Build where clause
    const where = {};
    if (status) {
      where.status = status;
    }

    // Get leave requests with employee data
    const permintaanCuti = await Permintaan_Cuti.findAll({
      include: [{
        model: Pegawai,
        attributes: ['nama', 'NIP'],
        where: search ? {
          [Op.or]: [
            { nama: { [Op.like]: `%${search}%` } },
            { NI: { [Op.like]: `%${search}%` } }
          ]
        } : undefined
      }],
      order: [['createdAt', 'DESC']]
    });

    // Format the data to match the UI structure
    const formattedRequests = permintaanCuti.map(request => ({
      no: request.id_permintaan,
      tanggal_pengajuan: request.createdAt,
      nama: request.Pegawai.nama,
      alasan: request.keterangan,
      tanggal_cuti: `${new Date(request.tanggal_mulai).toLocaleDateString('id-ID')} - ${new Date(request.tanggal_selesai).toLocaleDateString('id-ID')}`,
      status: request.status
    }));

    res.json({
      success: true,
      data: formattedRequests
    });
  } catch (error) {
    next(error);
  }
};

exports.approvePermintaanCuti = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permintaanCuti = await Permintaan_Cuti.findByPk(id, {
      include: [{
        model: Pegawai,
        attributes: ['nama', 'NIP']
      }]
    });

    if (!permintaanCuti) {
      return res.status(404).json({
        success: false,
        message: 'Permintaan cuti tidak ditemukan'
      });
    }

    // Update leave request status
    await permintaanCuti.update({ status: 'disetujui' });

    // Calculate remaining leave days
    const startDate = new Date(permintaanCuti.tanggal_mulai);
    const endDate = new Date(permintaanCuti.tanggal_selesai);
    const daysUsed = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Update employee's remaining leave days
    await Pegawai.decrement(
      { sisa_cuti: daysUsed },
      { where: { NIP: permintaanCuti.NIP } }
    );

    res.json({
      success: true,
      message: 'Permintaan cuti berhasil disetujui',
      data: permintaanCuti
    });
  } catch (error) {
    next(error);
  }
};

exports.rejectpermintaanCuti = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { alasan_penolakan } = req.body;

    const permintaanCuti = await Permintaan_Cuti.findByPk(id, {
      include: [{
        model: Pegawai,
        attributes: ['nama', 'NIP']
      }]
    });

    if (!permintaanCuti) {
      return res.status(404).json({
        success: false,
        message: 'Permintaan cuti tidak ditemukan'
      });
    }

    // Update leave request status and rejection reason
    await permintaanCuti.update({
      status: 'ditolak',
      alasan: alasan_penolakan
    });

    res.json({
      success: true,
      message: 'Permintaan cuti berhasil ditolak',
      data: permintaanCuti
    });
  } catch (error) {
    next(error);
  }
};

exports.pengajuanCuti = async (req, res, next) => { 
  try {
    const { tanggal_mulai, tanggal_selesai, jenis_cuti, keterangan } = req.body;
    const userId = req.userId;

    if (!tanggal_mulai || !tanggal_selesai || !jenis_cuti) {
      return res.status(400).json({ message: 'Semua field harus diisi kecuali keterangan.' });
    }

    if (new Date(tanggal_selesai) <= new Date(tanggal_mulai)) {
      return res.status(400).json({ message: 'Tanggal selesai harus lebih besar dari tanggal mulai.' });
    }

    const newCuti = await Permintaan_Cuti.create({
      NIP: userId,
      tanggal_mulai,
      tanggal_selesai,
      jenis_cuti,
      keterangan,
    });

    res.status(201).json({
      message: 'Pengajuan cuti berhasil disimpan.',
      data: newCuti,
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan pengajuan cuti.' });
  }
};