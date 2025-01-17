'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Surat_Izin_Cutis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_permintaan: {
        type: Sequelize.INTEGER
      },
      id_pejabat: {
        type: Sequelize.STRING
      },
      nomor_surat: {
        type: Sequelize.STRING
      },
      tanggal_terbit: {
        type: Sequelize.DATE
      },
      keterangan: {
        type: Sequelize.STRING
      },
      tembusan: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Surat_Izin_Cutis');
  }
};