"use strict";

const { Op } = require("sequelize");
const { Permintaan_Cuti, Pegawai } = require("../models");

const approveLeave = async (req, res) => {
    try {
        const { id_permintaan } = req.params;

        // Cari record pengajuan cuti berdasarkan id_permintaan
        const request = await Permintaan_Cuti.findByPk(id_permintaan);
        if (!request) {
            return res
                .status(404)
                .json({ error: "Pengajuan cuti tidak ditemukan." });
        }

        // Hanya proses jika statusnya "Diajukan" atau "Dalam Proses"
        if (!["Diajukan", "Dalam Proses"].includes(request.status)) {
            return res
                .status(400)
                .json({ error: "Pengajuan ini tidak dapat disetujui." });
        }

        // Ubah status pengajuan menjadi "Disetujui"
        request.status = "Disetujui";
        await request.save();

        // Hitung total hari cuti yang diminta (inklusif)
        const startDate = new Date(request.tanggal_mulai);
        const endDate = new Date(request.tanggal_selesai);
        const diffTime = endDate.getTime() - startDate.getTime();
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Penggunaan dari hak tahun berjalan adalah totalDays dikurangi hari yang sudah diambil dari carry-over
        const usedCurrent = totalDays - request.sisa_cuti_dipakai;

        // Ambil data pegawai berdasarkan NIP dari pengajuan
        const pegawai = await Pegawai.findOne({ where: { NIP: request.NIP } });
        if (!pegawai) {
            return res
                .status(404)
                .json({ error: "Data pegawai tidak ditemukan." });
        }

        // Validasi apakah sisa cuti tahun berjalan mencukupi
        if (pegawai.sisa_cuti < usedCurrent) {
            return res.status(400).json({
                error: "Sisa cuti tidak mencukupi untuk pengajuan ini.",
            });
        }

        // Kurangi sisa cuti pegawai dengan penggunaan dari tahun berjalan
        pegawai.sisa_cuti = pegawai.sisa_cuti - usedCurrent;
        await pegawai.save();

        return res.status(200).json({
            message: "Pengajuan cuti telah disetujui dan sisa cuti diperbarui.",
            data: {
                request,
                updatedSisaCuti: pegawai.sisa_cuti,
                usedCurrent: usedCurrent,
                totalDays: totalDays,
            },
        });
    } catch (error) {
        console.error("Error approving leave:", error);
        return res.status(500).json({
            error: "Terjadi kesalahan saat menyetujui pengajuan cuti.",
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Harus berupa "Disetujui" atau "Ditolak"

        // Cari record pengajuan berdasarkan id_permintaan
        const leaveRequest = await Permintaan_Cuti.findByPk(id);
        if (!leaveRequest) {
            return res
                .status(404)
                .json({ message: "Pengajuan cuti tidak ditemukan." });
        }

        // Hanya izinkan update jika status masih pending (misalnya "Diajukan" atau "Dalam Proses")
        if (!["Diajukan", "Dalam Proses"].includes(leaveRequest.status)) {
            return res
                .status(400)
                .json({ message: "Pengajuan cuti sudah diproses." });
        }

        // Update status pengajuan
        leaveRequest.status = status;
        await leaveRequest.save();

        // Jika diperlukan, Anda dapat memanggil fungsi pengurangan hak cuti (reduceLeaveBalance)
        // jika status disetujui.
        // Contoh (jika ada fungsi reduceLeaveBalance):
        // if(status === "Disetujui"){
        //    await reduceLeaveBalance(leaveRequest.NIP, new Date(leaveRequest.tanggal_mulai).getFullYear(), <jumlah hari yang dipakai dari hak tahun berjalan>);
        // }

        return res.json({
            message: `Pengajuan cuti berhasil ${
                status === "Disetujui" ? "disetujui" : "ditolak"
            }.`,
        });
    } catch (error) {
        console.error("Error updating status:", error);
        return res
            .status(500)
            .json({
                message:
                    "Terjadi kesalahan saat memperbarui status pengajuan cuti.",
            });
    }
};

const getPendingLeaveRequests = async (req, res, next) => {
    try {
      const pendingRequests = await Permintaan_Cuti.findAll({
        where: {
          status: { [Op.in]: ["Diajukan", "Dalam Proses"] }
        },
        order: [["createdAt", "DESC"]],
        include: [{ model: Pegawai, attributes: ["nama"] }]
      });
      req.leaveRequests = pendingRequests;
      next();
    } catch (error) {
      next(error);
    }
  };

  const getEmployeesOnLeave = async (req, res, next) => {
    try {
      const today = new Date();
      // Cari pengajuan yang sudah disetujui dengan tanggal hari ini di antara tanggal_mulai dan tanggal_selesai
      const onLeaveRequests = await Permintaan_Cuti.findAll({
        where: {
          status: "Disetujui",
          tanggal_mulai: { [Op.lte]: today },
          tanggal_selesai: { [Op.gte]: today }
        },
        order: [["tanggal_mulai", "ASC"]],
        include: [{ model: Pegawai, attributes: ["nama"] }]
      });
      req.employeesOnLeave = onLeaveRequests;
      next();
    } catch (error) {
      next(error);
    }
  };

  const countPendingLeaveRequests = async (req, res, next) => {
    try {
      const pendingRequests = await Permintaan_Cuti.findAll({
        where: { status: "Diajukan" },
        order: [["createdAt", "DESC"]],
        include: [{ model: Pegawai, attributes: ["nama"] }],
        group: ["Permintaan_Cuti.id"] // pastikan hanya satu baris per pengajuan
      });
      req.leaveRequests = pendingRequests;
      req.pendingCount = pendingRequests.length;
      next();
    } catch (error) {
      next(error);
    }
  };

  const countEmployeesOnLeave = async (req, res, next) => {
    try {
      const today = new Date();
      // Cari pengajuan cuti yang sudah disetujui dengan tanggal hari ini di antara tanggal_mulai dan tanggal_selesai
      const onLeaveList = await Permintaan_Cuti.findAll({
        where: {
          status: "Disetujui",
          tanggal_mulai: { [Op.lte]: today },
          tanggal_selesai: { [Op.gte]: today }
        },
        group: ['Pegawai.NIP'],  // Mengelompokkan berdasarkan NIP agar satu pegawai hanya muncul satu kali
        order: [["tanggal_mulai", "ASC"]],
        include: [{ model: Pegawai, attributes: ["nama", "NIP"] }]
      });
      req.employeesOnLeave = onLeaveList;
      req.employeeOnLeaveCount = onLeaveList.length; // jumlah pegawai yang sedang cuti
      next();
    } catch (error) {
      next(error);
    }
  };

  
module.exports = { approveLeave, updateStatus, getPendingLeaveRequests, getEmployeesOnLeave,countPendingLeaveRequests,countEmployeesOnLeave };
