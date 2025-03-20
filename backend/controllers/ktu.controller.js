"use strict";

const { Op } = require("sequelize");
const { Permintaan_Cuti, Pegawai,Sisa_Cuti } = require("../models");

const updateStatusKtu = async (req, res) => {
    try {
        const { id } = req.params;
        // Cari pengajuan berdasarkan id
        const request = await Permintaan_Cuti.findByPk(id);
        if (!request) {
          return res.status(404).json({ message: "Pengajuan cuti tidak ditemukan." });
        }
        // Hanya izinkan pembatalan jika status masih "Diajukan" atau "Dalam Proses"
        if (!["Diajukan", "Dalam Proses" ,"Disetujui"].includes(request.status)) {
          return res.status(400).json({ message: "Pengajuan yang sudah diproses tidak dapat dibatalkan." });
        }
        // Ganti status menjadi "Dibatalkan"
        request.status = "Dibatalkan";
        await request.save();
        return res.json({ message: "Pengajuan cuti berhasil dibatalkan." });
      } catch (error) {
        console.error("Error canceling leave:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat membatalkan pengajuan cuti." });
      }
};

const getAllPegawaiWithLeaveData = async (req, res, next) => {
  try {
    // Ambil semua pegawai
    const pegawais = await Pegawai.findAll({
      attributes: ["id", "NIP", "nama", "jumlah_hak", "sisa_cuti"],
      distinct: true
    });
    const currentYear = new Date().getFullYear();

    const pegawaiWithLeaveData = await Promise.all(
      pegawais.map(async (pegawai) => {
        // Ambil pengajuan cuti yang disetujui untuk pegawai ini pada tahun berjalan
        const approvedLeaves = await Permintaan_Cuti.findAll({
          where: {
            NIP: pegawai.NIP,
            status: "Disetujui",
            tanggal_mulai: {
              [Op.between]: [new Date(currentYear, 0, 1), new Date(currentYear, 11, 31)]
            }
          }
        });

        let usedDays = 0;
        approvedLeaves.forEach((request) => {
          const start = new Date(request.tanggal_mulai);
          const end = new Date(request.tanggal_selesai);
          const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          usedDays += diffDays;
        });

        // Ambil record sisa_cuti untuk tahun berjalan, Y-1 dan Y-2
        const recordY3 = await Sisa_Cuti.findOne({
          where: { NIP: pegawai.NIP, tahun: currentYear }
        });
        const recordY1 = await Sisa_Cuti.findOne({
          where: { NIP: pegawai.NIP, tahun: currentYear - 1 }
        });
        const recordY2 = await Sisa_Cuti.findOne({
          where: { NIP: pegawai.NIP, tahun: currentYear - 2 }
        });

        // Hak cuti tahun berjalan diambil dari recordY3; jika tidak ada, asumsikan 12
        const availableY3 = recordY3 ? recordY3.sisa_cuti : 12;
        // Untuk carry-over, maksimal yang bisa dipakai per tahun adalah 6
        const availableY1 = recordY1 ? Math.min(recordY1.sisa_cuti, 6) : 0;
        const availableY2 = recordY2 ? Math.min(recordY2.sisa_cuti, 6) : 0;

        let totalPotential;
        if (recordY1 && recordY2 && recordY1.sisa_cuti >= 12 && recordY2.sisa_cuti >= 12) {
          totalPotential = 24;
        } else {
          totalPotential = Math.min(availableY3 + availableY1 + availableY2, 18);
        }

        const remainingLeave = totalPotential - usedDays;

        // Kembalikan data pegawai dengan properti tambahan
        return {
          ...pegawai.get(),
          totalHakCuti: totalPotential,
          sisaCuti: remainingLeave >= 0 ? remainingLeave : 0
        };
      })
    );

    req.pegawaiWithLeave = pegawaiWithLeaveData;
    next();
  } catch (error) {
    next(error);
  }
  };

  const getRekapanData = async (req, res, next) => {
    try {
      const currentYear = new Date().getFullYear();
      // Ambil hanya pengajuan yang disetujui, lalu sertakan data pegawai
      const pengajuan = await Permintaan_Cuti.findAll({
        where: { status: "Disetujui" }, // Filter hanya status disetujui
        order: [["createdAt", "DESC"]],
        include: [{ model: Pegawai, attributes: ["nama", "NIP"] }]
      });
    
      const rekapanData = await Promise.all(
        pengajuan.map(async (record) => {
          const start = new Date(record.tanggal_mulai);
          const end = new Date(record.tanggal_selesai);
          const lamaCuti =
            Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
          // Pengajuan cuti yang disetujui pada tahun berjalan
          const approvedLeaves = await Permintaan_Cuti.findAll({
            where: {
              NIP: record.Pegawai.NIP,
              status: "Disetujui",
              tanggal_mulai: {
                [Op.between]: [
                  new Date(currentYear, 0, 1),
                  new Date(currentYear, 11, 31)
                ]
              }
            }
          });
    
          let usedDays = 0;
          approvedLeaves.forEach((leave) => {
            const s = new Date(leave.tanggal_mulai);
            const e = new Date(leave.tanggal_selesai);
            const diffDays =
              Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            usedDays += diffDays;
          });
    
          const recordY3 = await Sisa_Cuti.findOne({
            where: { NIP: record.Pegawai.NIP, tahun: currentYear }
          });
          const recordY1 = await Sisa_Cuti.findOne({
            where: { NIP: record.Pegawai.NIP, tahun: currentYear - 1 }
          });
          const recordY2 = await Sisa_Cuti.findOne({
            where: { NIP: record.Pegawai.NIP, tahun: currentYear - 2 }
          });
    
          const availableY3 = recordY3 ? recordY3.sisa_cuti : 12;
          const availableY1 = recordY1 ? Math.min(recordY1.sisa_cuti, 6) : 0;
          const availableY2 = recordY2 ? Math.min(recordY2.sisa_cuti, 6) : 0;
    
          let totalPotential;
          if (
            recordY1 &&
            recordY2 &&
            recordY1.sisa_cuti >= 12 &&
            recordY2.sisa_cuti >= 12
          ) {
            totalPotential = 24;
          } else {
            totalPotential = Math.min(availableY3 + availableY1 + availableY2, 18);
          }
    
          const remainingLeave = totalPotential - usedDays;
    
          return {
            id: record.id_permintaan,
            nama: record.Pegawai.nama,
            tanggalMulai: start,
            tanggalSelesai: end,
            lamaCuti,
            sisaCuti: remainingLeave >= 0 ? remainingLeave : 0
          };
        })
      );
    
      req.rekapan = rekapanData;
      next();
    } catch (error) {
      next(error);
    }
  };
module.exports = { updateStatusKtu,getAllPegawaiWithLeaveData,getRekapanData};
