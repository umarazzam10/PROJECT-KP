'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Sisa_Cutis', [
      // Contoh data untuk pegawai dengan NIP '196910161998032001'
      {
        id: 1,
        NIP: '196910161998032001',
        tahun: 2022, // sisa cuti dari tahun 2022
        sisa_cuti: 9, // misalnya, 9 hari sisa (meskipun yang digunakan maksimal 6)
      },
      // Data untuk pegawai dengan NIP '196004061981031003'
      {
        id: 2,
        NIP: '196004061981031003',
        tahun: 2022,
        sisa_cuti: 5, // misalnya, 5 hari sisa
      },
      // Data untuk pegawai dengan NIP '196910161998032001' untuk tahun 2021 (untuk menguji batas lebih dari 2 tahun)
      {
        id: 3,
        NIP: '196910161998032001',
        tahun: 2021,
        sisa_cuti: 4,
      },
      // Data untuk pegawai lain
      {
        id: 4,
        NIP: '198401242006041002',
        tahun: 2022,
        sisa_cuti: 7,
      },
      {
        id: 5,
        NIP: '198006172006041006',
        tahun: 2022,
        sisa_cuti: 8,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus semua data dari tabel Sisa_Cuti
    await queryInterface.bulkDelete('Sisa_Cuti', null, {});
  }
};
