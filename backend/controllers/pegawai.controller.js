// controllers/PermintaanCutiController.js
"use strict";

const { Op } = require("sequelize");
const { Permintaan_Cuti, Sisa_Cuti } = require("../models");

module.exports = {
    /**
     * Fungsi applyLeave mengimplementasikan logika pengajuan cuti:
     * - Menghitung total hari cuti yang tersedia pada tahun pengajuan:
     *   * Hak cuti tahun berjalan selalu 12 hari.
     *   * Carry-over dari tahun sebelumnya (Y-1) dan dua tahun sebelumnya (Y-2)
     *     diambil dengan batas maksimum 6 hari masing-masing.
     * - Penggunaan cuti dilakukan dengan prioritas:
     *   * Menggunakan terlebih dahulu carry-over dari tahun paling lama (Y-2)
     *   * Kemudian carry-over dari tahun sebelumnya (Y-1)
     *   * Selanjutnya menggunakan hak cuti tahun berjalan.
     * - Total penggunaan pada tahun pengajuan tidak boleh melebihi 18 hari.
     * - Jika pengajuan melebihi batas, akan dikembalikan error.
     *
     * Parameter yang diharapkan di req.body:
     *   NIP: string, applicationYear: number, requestedDays: number,
     *   tanggal_mulai (opsional, bisa dihitung berdasarkan applicationYear dan requestedDays),
     *   jenis_cuti, keterangan.
     */
    applyLeave: async (req, res) => {
        try {
            const {
                NIP,
                applicationYear,
                requestedDays,
                jenis_cuti,
                keterangan,
            } = req.body;

            // Tetapkan hak cuti tahun berjalan (default 12 hari)
            const currentEntitlement = 12;

            // Ambil data carry-over dari dua tahun sebelumnya.
            // Tahun sebelumnya: applicationYear - 1
            const recordY1 = await Sisa_Cuti.findOne({
                where: { NIP, tahun: applicationYear - 1 },
            });
            let carryY1 = recordY1 ? Math.min(recordY1.sisa_cuti, 6) : 0;

            // Dua tahun sebelumnya: applicationYear - 2
            const recordY2 = await Sisa_Cuti.findOne({
                where: { NIP, tahun: applicationYear - 2 },
            });
            let carryY2 = recordY2 ? Math.min(recordY2.sisa_cuti, 6) : 0;

            // Total available = current entitlement + carry-over (Y-1 + Y-2)
            const totalAvailable = currentEntitlement + carryY1 + carryY2;

            // Penggunaan cuti maksimum adalah 18 hari, meskipun totalAvailable bisa lebih tinggi.
            const maxUsable = Math.min(totalAvailable, 18);

            if (requestedDays > maxUsable) {
                return res.status(400).json({
                    error: `Pengajuan cuti melebihi batas maksimal penggunaan. Maksimal yang dapat dipakai tahun ini adalah ${maxUsable} hari.`,
                });
            }

            // Alokasikan penggunaan cuti: prioritas: carry-over dari Y-2, lalu Y-1, baru hak cuti tahun berjalan.
            let usedY2 = 0,
                usedY1 = 0,
                usedCurrent = 0;
            let remaining = requestedDays;

            // Gunakan carry dari dua tahun sebelumnya (Y-2) terlebih dahulu.
            if (carryY2 > 0) {
                usedY2 = Math.min(remaining, carryY2);
                remaining -= usedY2;
            }

            // Gunakan carry dari tahun sebelumnya (Y-1) berikutnya.
            if (remaining > 0 && carryY1 > 0) {
                usedY1 = Math.min(remaining, carryY1);
                remaining -= usedY1;
            }

            // Sisa penggunaan diambil dari hak cuti tahun berjalan.
            if (remaining > 0) {
                usedCurrent = remaining;
                remaining = 0;
            }

            // Update record Sisa_Cuti (jika ada) untuk tahun Y-2 dan Y-1.
            if (recordY2) {
                recordY2.sisa_cuti = recordY2.sisa_cuti - usedY2;
                await recordY2.save();
            }
            if (recordY1) {
                recordY1.sisa_cuti = recordY1.sisa_cuti - usedY1;
                await recordY1.save();
            }

            // Tentukan tanggal_mulai dan tanggal_selesai, jika belum diberikan.
            // Misalnya, jika tidak diberikan, kita asumsikan tanggal_mulai adalah hari ini (atau hari pertama tahun applicationYear)
            // dan tanggal_selesai adalah tanggal_mulai + (requestedDays - 1).
            const startDate = req.body.tanggal_mulai
                ? new Date(req.body.tanggal_mulai)
                : new Date(applicationYear, 0, 1);
            const endDate = req.body.tanggal_selesai
                ? new Date(req.body.tanggal_selesai)
                : new Date(
                      startDate.getTime() +
                          (requestedDays - 1) * 24 * 60 * 60 * 1000
                  );

            // Buat record pengajuan cuti baru
            const newRequest = await Permintaan_Cuti.create({
                NIP,
                tanggal_mulai: startDate,
                tanggal_selesai: endDate,
                status: "Diajukan",
                jenis_cuti,
                keterangan: `${
                    keterangan || ""
                } | Penggunaan: ${usedY2} hari dari ${
                    applicationYear - 2
                }, ${usedY1} hari dari ${
                    applicationYear - 1
                }, ${usedCurrent} hari dari ${applicationYear}.`,
                sisa_cuti_dipakai: usedY2 + usedY1, // jumlah hari yang diambil dari carry-over
            });

            return res.status(201).json({
                message: "Pengajuan cuti berhasil diajukan.",
                data: {
                    request: newRequest,
                    usage: {
                        usedFromYearMinus2: usedY2,
                        usedFromYearMinus1: usedY1,
                        usedFromCurrentYear: usedCurrent,
                        totalUsed: requestedDays,
                        maxUsable: maxUsable,
                    },
                },
            });
        } catch (error) {
            console.error("Error applying leave:", error);
            return res
                .status(500)
                .json({ error: "Terjadi kesalahan saat pengajuan cuti." });
        }
    },
};
