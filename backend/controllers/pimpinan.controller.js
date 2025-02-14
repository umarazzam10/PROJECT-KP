"use strict";

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
            return res
                .status(400)
                .json({
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
        return res
            .status(500)
            .json({
                error: "Terjadi kesalahan saat menyetujui pengajuan cuti.",
            });
    }
};