const cron = require('node-cron');
const { Pegawai, Sisa_Cuti } = require('../models');

// Scheduler dijalankan setiap tanggal 1 Januari pada pukul 00:00
cron.schedule('0 0 1 1 *', async () => {
  try {
    const currentYear = new Date().getFullYear();
    console.log(`Menjalankan scheduler penambahan sisa cuti untuk tahun ${currentYear}`);
    
    // Dapatkan semua pegawai
    const pegawais = await Pegawai.findAll();
    for (const pegawai of pegawais) {
      // Periksa apakah sudah ada record Sisa_Cuti untuk tahun berjalan
      const existingRecord = await Sisa_Cuti.findOne({
        where: { NIP: pegawai.NIP, tahun: currentYear }
      });
      
      // Jika belum ada, buat record baru dengan sisa cuti awal 12 hari
      if (!existingRecord) {
        await Sisa_Cuti.create({
          NIP: pegawai.NIP,
          tahun: currentYear,
          sisa_cuti: 12
        });
        console.log(`Record sisa cuti dibuat untuk ${pegawai.NIP} tahun ${currentYear}`);
      }
    }
    console.log('Scheduler penambahan sisa cuti selesai.');
  } catch (error) {
    console.error('Error menjalankan scheduler penambahan sisa cuti:', error);
  }
});
