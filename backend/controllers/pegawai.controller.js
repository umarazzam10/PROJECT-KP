"use strict";

const { Op } = require("sequelize");
const { Permintaan_Cuti, Sisa_Cuti, Pegawai } = require("../models");
/**
 * Fungsi applyLeave mengimplementasikan logika pengajuan cuti.
 */
// const applyLeave = async (req, res) => {
//     try {
//         const {
//             NIP,
//             applicationYear,
//             requestedDays,
//             jenis_cuti,
//             keterangan,
//         } = req.body;

//         // Tetapkan hak cuti tahun berjalan (default 12 hari)
//         const currentEntitlement = 12;

//         // Ambil data carry-over dari dua tahun sebelumnya.
//         const recordY1 = await Sisa_Cuti.findOne({
//             where: { NIP, tahun: applicationYear - 1 },
//         });
//         let carryY1 = recordY1 ? Math.min(recordY1.Sisa_Cuti, 6) : 0;

//         const recordY2 = await Sisa_Cuti.findOne({
//             where: { NIP, tahun: applicationYear - 2 },
//         });
//         let carryY2 = recordY2 ? Math.min(recordY2.Sisa_Cuti, 6) : 0;

//         // Total available = current entitlement + carry-over (Y-1 + Y-2)
//         const totalAvailable = currentEntitlement + carryY1 + carryY2;

//         // Penggunaan cuti maksimum adalah 18 hari, meskipun totalAvailable bisa lebih tinggi.
//         const maxUsable = Math.min(totalAvailable, 18);

//         if (requestedDays > maxUsable) {
//             return res.status(400).json({
//                 error: `Pengajuan cuti melebihi batas maksimal penggunaan. Maksimal yang dapat dipakai tahun ini adalah ${maxUsable} hari.`,
//             });
//         }

//         // Alokasikan penggunaan cuti: prioritas: carry-over dari Y-2, lalu Y-1, baru hak cuti tahun berjalan.
//         let usedY2 = 0, usedY1 = 0, usedCurrent = 0;
//         let remaining = requestedDays;

//         if (carryY2 > 0) {
//             usedY2 = Math.min(remaining, carryY2);
//             remaining -= usedY2;
//         }

//         if (remaining > 0 && carryY1 > 0) {
//             usedY1 = Math.min(remaining, carryY1);
//             remaining -= usedY1;
//         }

//         if (remaining > 0) {
//             usedCurrent = remaining;
//             remaining = 0;
//         }

//         // Update record Sisa_Cuti (jika ada) untuk tahun Y-2 dan Y-1.
//         if (recordY2) {
//             recordY2.Sisa_Cuti = recordY2.Sisa_Cuti - usedY2;
//             await recordY2.save();
//         }
//         if (recordY1) {
//             recordY1.Sisa_Cuti = recordY1.Sisa_Cuti - usedY1;
//             await recordY1.save();
//         }

//         // Tentukan tanggal_mulai dan tanggal_selesai, jika belum diberikan.
//         const startDate = req.body.tanggal_mulai
//             ? new Date(req.body.tanggal_mulai)
//             : new Date(applicationYear, 0, 1);
//         const endDate = req.body.tanggal_selesai
//             ? new Date(req.body.tanggal_selesai)
//             : new Date(startDate.getTime() + (requestedDays - 1) * 24 * 60 * 60 * 1000);

//         // Buat record pengajuan cuti baru
//         const newRequest = await Permintaan_Cuti.create({
//             NIP,
//             tanggal_mulai: startDate,
//             tanggal_selesai: endDate,
//             status: "Diajukan",
//             jenis_cuti,
//             keterangan: `${
//                 keterangan || ""
//             } | Penggunaan: ${usedY2} hari dari ${
//                 applicationYear - 2
//             }, ${usedY1} hari dari ${
//                 applicationYear - 1
//             }, ${usedCurrent} hari dari ${applicationYear}.`,
//             Sisa_Cuti_dipakai: usedY2 + usedY1, // jumlah hari yang diambil dari carry-over
//         });

//         return res.status(201).json({
//             message: "Pengajuan cuti berhasil diajukan.",
//             data: {
//                 request: newRequest,
//                 usage: {
//                     usedFromYearMinus2: usedY2,
//                     usedFromYearMinus1: usedY1,
//                     usedFromCurrentYear: usedCurrent,
//                     totalUsed: requestedDays,
//                     maxUsable: maxUsable,
//                 },
//             },
//         });
//     } catch (error) {
//         console.error("Error applying leave:", error);
//         return res.status(500).json({ error: "Terjadi kesalahan saat pengajuan cuti." });
//     }
// };

// const applyLeave = async (req, res) => {
//     try {
//         const { NIP, applicationYear, requestedDays, jenis_cuti, keterangan } =
//             req.body;

//         // Cek apakah sudah ada pengajuan cuti yang belum selesai (status Diajukan atau Dalam Proses)
//         const pendingRequest = await Permintaan_Cuti.findOne({
//             where: { NIP, status: { [Op.in]: ["Diajukan", "Dalam Proses"] } },
//         });
//         if (pendingRequest) {
//             return res.status(400).json({
//                 error: "Anda sudah memiliki pengajuan cuti yang sedang diproses. Tidak dapat menambah pengajuan baru.",
//             });
//         }

//         // Tetapkan hak cuti tahun berjalan (default 12 hari)
//         const currentEntitlement = 12;

//         // Ambil data carry-over dari dua tahun sebelumnya.
//         const recordY1 = await Sisa_Cuti.findOne({
//             where: { NIP, tahun: applicationYear - 1 },
//         });
//         let carryY1 = recordY1 ? Math.min(recordY1.sisa_cuti, 6) : 0;

//         const recordY2 = await Sisa_Cuti.findOne({
//             where: { NIP, tahun: applicationYear - 2 },
//         });
//         let carryY2 = recordY2 ? Math.min(recordY2.sisa_cuti, 6) : 0;

//         // Total available = current entitlement + carry-over (Y-1 + Y-2)
//         const totalAvailable = currentEntitlement + carryY1 + carryY2;

//         // Penggunaan cuti maksimum adalah 18 hari, meskipun totalAvailable bisa lebih tinggi.
//         const maxUsable = Math.min(totalAvailable, 18);

//         if (requestedDays > maxUsable) {
//             return res.status(400).json({
//                 error: `Pengajuan cuti melebihi batas maksimal penggunaan. Maksimal yang dapat dipakai tahun ini adalah ${maxUsable} hari.`,
//             });
//         }

//         // Alokasikan penggunaan cuti: prioritas: carry-over dari Y-2, lalu Y-1, baru hak cuti tahun berjalan.
//         let usedY2 = 0,
//             usedY1 = 0,
//             usedCurrent = 0;
//         let remaining = requestedDays;

//         if (carryY2 > 0) {
//             usedY2 = Math.min(remaining, carryY2);
//             remaining -= usedY2;
//         }

//         if (remaining > 0 && carryY1 > 0) {
//             usedY1 = Math.min(remaining, carryY1);
//             remaining -= usedY1;
//         }

//         if (remaining > 0) {
//             usedCurrent = remaining;
//             remaining = 0;
//         }

//         // Catat alokasi penggunaan (untuk referensi) tanpa mengupdate tabel Sisa_Cuti di sini
//         const allocationInfo = `Penggunaan: ${usedY2} hari dari ${
//             applicationYear - 2
//         }, ${usedY1} hari dari ${
//             applicationYear - 1
//         }, ${usedCurrent} hari dari ${applicationYear}.`;

//         // Tentukan tanggal_mulai dan tanggal_selesai, jika belum diberikan.
//         const startDate = req.body.tanggal_mulai
//             ? new Date(req.body.tanggal_mulai)
//             : new Date(applicationYear, 0, 1);
//         const endDate = req.body.tanggal_selesai
//             ? new Date(req.body.tanggal_selesai)
//             : new Date(
//                   startDate.getTime() +
//                       (requestedDays - 1) * 24 * 60 * 60 * 1000
//               );

//         // Buat record pengajuan cuti baru dengan status "Diajukan"
//         const newRequest = await Permintaan_Cuti.create({
//             NIP,
//             tanggal_mulai: startDate,
//             tanggal_selesai: endDate,
//             status: "Diajukan",
//             jenis_cuti,
//             keterangan: `${keterangan}`,
//             sisa_cuti_dipakai: usedY2 + usedY1, // jumlah hari yang diambil dari carry-over
//         });

//         req.flash("success", "Pengajuan cuti berhasil diajukan.");
//         return res.redirect("/");
//     } catch (error) {
//         console.error("Error applying leave:", error);
//         req.flash("error", "Terjadi kesalahan saat pengajuan cuti.");
//         return res.redirect("back");
//     }
// };

const applyLeave = async (req, res) => {
    try {
        const { NIP, applicationYear, requestedDays, jenis_cuti, keterangan } =
            req.body;

                    const pendingRequest = await Permintaan_Cuti.findOne({
            where: { NIP, status: { [Op.in]: ["Diajukan", "Dalam Proses"] } },
        });
        if (pendingRequest) {
           req.flash(
                "error",
                `Anda sudah memiliki pengajuan cuti yang sedang diproses. Tidak dapat menambah pengajuan baru.`
            );
            return res.redirect("back");
        }

        // Hak cuti tahun berjalan tetap 12 hari.
        const currentEntitlement = await Sisa_Cuti.findOne({
            where: { NIP, tahun: applicationYear},
        });;

        // Ambil data carry-over dari dua tahun sebelumnya (Y-1 dan Y-2)
        const recordY1 = await Sisa_Cuti.findOne({
            where: { NIP, tahun: applicationYear - 1 },
        });
        const recordY2 = await Sisa_Cuti.findOne({
            where: { NIP, tahun: applicationYear - 2 },
        });

        // Efektif carry-over: maksimal yang bisa dipakai per tahun adalah 6 hari, meskipun nilai aslinya bisa lebih tinggi.
        const availableY1 = recordY1 ? Math.min(recordY1.sisa_cuti, 6) : 0;
        const availableY2 = recordY2 ? Math.min(recordY2.sisa_cuti, 6) : 0;
        const availableY3 = currentEntitlement ? currentEntitlement.sisa_cuti : 0;

        // Total potensi yang tersedia = hak tahun berjalan + carry-over
        const totalAvailable = availableY3 + availableY1 + availableY2;

        // Jika dan hanya jika sisa cuti di 2 tahun sebelumnya masing-masing utuh (≥12),
        // maka jatah cuti yang dapat dipakai di tahun berjalan adalah 24,
        // jika tidak, maksimal yang bisa dipakai adalah minimum(totalAvailable, 18).
        let maxUsable;
        if (
            recordY1 &&
            recordY2 &&
            recordY1.sisa_cuti >= 12 &&
            recordY2.sisa_cuti >= 12
        ) {
            maxUsable = 24;
        } else {
            maxUsable = Math.min(totalAvailable, 18);
        }

        if (requestedDays > maxUsable) {
            req.flash(
                "error",
                `Pengajuan cuti melebihi batas maksimal penggunaan. Maksimal yang dapat dipakai tahun ini adalah ${maxUsable} hari.`
            );
            return res.redirect("back");
        }

        // Alokasikan penggunaan cuti berdasarkan prioritas:
        // Pertama dari carry-over dua tahun sebelumnya (Y-2), lalu Y-1, kemudian hak tahun berjalan.
        let remaining = requestedDays;
        let usedY2 = Math.min(remaining, availableY2);
        remaining -= usedY2;

        let usedY1 = Math.min(remaining, availableY1);
        remaining -= usedY1;

        let usedCurrent = remaining; // sisanya dari hak tahun berjalan

        // Catat informasi alokasi untuk referensi (informasi ini dicantumkan di keterangan pengajuan)
        const allocationInfo = `Penggunaan: ${usedY2} hari dari ${
            applicationYear - 2
        }, ${usedY1} hari dari ${
            applicationYear - 1
        }, ${usedCurrent} hari dari ${applicationYear}.`;

        // Tentukan tanggal_mulai dan tanggal_selesai jika tidak diberikan.
        const startDate = req.body.tanggal_mulai
            ? new Date(req.body.tanggal_mulai)
            : new Date(applicationYear, 0, 1);
        const endDate = req.body.tanggal_selesai
            ? new Date(req.body.tanggal_selesai)
            : new Date(
                startDate.getTime() +
                      (requestedDays - 1) * 24 * 60 * 60 * 1000
            );

        // Buat record pengajuan cuti baru dengan status "Diajukan"
        await Permintaan_Cuti.create({
            NIP,
            tanggal_mulai: startDate,
            tanggal_selesai: endDate,
            status: "Diajukan",
            jenis_cuti,
            keterangan: `${keterangan}`,
            sisa_cuti_dipakai: usedY2 + usedY1,
            timestamps: true
        });

        req.flash("success", "Pengajuan cuti berhasil diajukan.");
        return res.redirect("/");
    } catch (error) {
        console.error("Error applying leave:", error);
        req.flash("error", "Terjadi kesalahan saat pengajuan cuti.");
        return res.redirect("back");
    }
};

const getRemainingLeave = async (req, res, next) => {
    try {
        const pegawai = req.pegawai;
        const currentYear = new Date().getFullYear();

        // Ambil semua pengajuan cuti yang disetujui pada tahun berjalan (berdasarkan tanggal_mulai)
        const approvedLeaves = await Permintaan_Cuti.findAll({
            where: {
                NIP: pegawai.NIP,
                status: "Disetujui",
                tanggal_mulai: {
                    [Op.between]: [
                        new Date(currentYear, 0, 1),
                        new Date(currentYear, 11, 31),
                    ],
                },
            },
        });

        // Hitung total hari yang telah digunakan pada tahun berjalan (inklusif)
        let usedDays = 0;
        approvedLeaves.forEach((request) => {
            const start = new Date(request.tanggal_mulai);
            const end = new Date(request.tanggal_selesai);
            const diffDays =
                Math.ceil(
                    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                ) + 1;
            usedDays += diffDays;
        });

        // Ambil carry-over dari tahun sebelumnya (Y-1) dan dua tahun sebelumnya (Y-2)
        const recordY1 = await Sisa_Cuti.findOne({
            where: { NIP: pegawai.NIP, tahun: currentYear - 1 },
        });
        const recordY2 = await Sisa_Cuti.findOne({
            where: { NIP: pegawai.NIP, tahun: currentYear - 2 },
        });
        const recordY3 = await Sisa_Cuti.findOne({
            where: { NIP: pegawai.NIP, tahun: currentYear},
        });

        // Efektif carry-over: maksimal yang dapat dipakai per tahun adalah 6 hari
        const carryY1 = recordY1 ? Math.min(recordY1.sisa_cuti, 6) : 0;
        const carryY2 = recordY2 ? Math.min(recordY2.sisa_cuti, 6) : 0;
        const carryY3 = recordY3 ? recordY3.sisa_cuti : 0;

        // Total potensi cuti dari carry-over (tanpa menghitung hak tahun berjalan)
        // Jika carry-over di 2 tahun sebelumnya utuh (≥12 hari masing-masing), total potensi cuti = 24 hari.
        // Jika tidak, total potensi = min(12 + carryY1 + carryY2, 18)
        let totalPotential;
        if (
            recordY1 &&
            recordY2 &&
            recordY1.sisa_cuti >= 12 &&
            recordY2.sisa_cuti >= 12
        ) {
            totalPotential = 24;
        } else {
            totalPotential = Math.min(carryY3 + carryY1 + carryY2, 18);
        }

        // Sisa cuti adalah total potensi dikurangi hari yang telah digunakan
        const remainingLeave = totalPotential - usedDays;

        req.remainingLeave = remainingLeave >= 0 ? remainingLeave : 0;
        next();
    } catch (error) {
        next(error);
    }
};

const getPegawaiData = async (req, res, next) => {
    try {
        const pegawai = await Pegawai.findOne({
            where: { nip: req.userId },
            attributes: ["NIP", "nama", "role"],
        });

        if (!pegawai) {
            // Jika data tidak ditemukan, silakan tangani sesuai kebutuhan
            return next(new Error("Data pegawai tidak ditemukan"));
        }

        // Simpan data pegawai ke req agar bisa digunakan di middleware selanjutnya
        req.pegawai = pegawai;
        return next();
    } catch (error) {
        return next(error);
    }
};

const getPegawaiDataAll = async (req, res, next) => {
    try {
        const pegawais = await Pegawai.findAll({
            attributes: ["NIP", "nama", "role"],
        });

        if (!pegawais || pegawais.length === 0) {
            return next(new Error("Data pegawai tidak ditemukan"));
        }

        // Simpan data pegawai ke req dengan nama yang jelas
        req.pegawais = pegawais;
        return next();
    } catch (error) {
        return next(error);
    }
};

const getPermintaan = async (req, res, next) => {
    try {
        // Ambil data permintaan cuti berdasarkan NIP pegawai yang sudah disimpan di req.pegawai
        const leaveRequests = await Permintaan_Cuti.findAll({
            where: { NIP: req.pegawai.NIP },
            order: [["tanggal_mulai", "DESC"]],
        });
        req.leaveRequests = leaveRequests;
        return next();
    } catch (error) {
        return next(error);
    }
};
const getPermintaanAll = async (req, res, next) => {
    try {
        const leaveRequests = await Permintaan_Cuti.findAll({
          // Jika ingin mengambil semua data permintaan
          order: [['createdAt', 'DESC']]
        });
        req.leaveRequests = leaveRequests;
        next();
      } catch (error) {
        next(error);
      }
};



const cancelLeave = async (req, res) => {
    try {
        const { id_permintaan } = req.params;

        // Ambil record pengajuan cuti berdasarkan id_permintaan
        const request = await Permintaan_Cuti.findByPk(id_permintaan);
        if (!request) {
            req.flash("error", "Pengajuan cuti tidak ditemukan.");
            return res.redirect("back");
        }

        // Hanya izinkan pembatalan jika status masih "Diajukan" atau "Dalam Proses"
        if (!["Diajukan", "Dalam Proses"].includes(request.status)) {
            req.flash(
                "error",
                "Pengajuan yang sudah disetujui atau diproses tidak dapat dibatalkan."
            );
            return res.redirect("back");
        }

        // Hapus record pengajuan cuti
        await request.destroy();
        req.flash("success", "Pengajuan cuti berhasil dibatalkan.");
        return res.redirect("back");
    } catch (error) {
        console.error("Error canceling leave:", error);
        req.flash("error", "Terjadi kesalahan saat pembatalan pengajuan cuti.");
        return res.redirect("back");
    }
};

// Ekspor semua fungsi dalam satu objek module.exports
module.exports = {
    applyLeave,
    getPegawaiData,
    getPermintaan,
    cancelLeave,
    getRemainingLeave,
    getPegawaiDataAll,
    getPermintaanAll
};
