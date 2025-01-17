'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Permintaan_Cutis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      NIP: {
        type: Sequelize.STRING
      },
      tanggal_mulai: {
        type: Sequelize.DATE
      },
      tanggal_selesai: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      jenis_cuti: {
        type: Sequelize.STRING
      },
      keterangan: {
        type: Sequelize.STRING
      },
      sisa_cuti_dipakai: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Permintaan_Cutis');
  }
};