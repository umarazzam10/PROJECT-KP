'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pegawais', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      NIP: {
        type: Sequelize.STRING
      },
      nama: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      pangkat_golongan: {
        type: Sequelize.STRING
      },
      jabatan: {
        type: Sequelize.STRING
      },
      satuan_organisasi: {
        type: Sequelize.STRING
      },
      jumlah_hak: {
        type: Sequelize.INTEGER
      },
      sisa_cuti: {
        type: Sequelize.INTEGER
      },
      unit_kerja: {
        type: Sequelize.STRING
      },
      tingkat_eselon: {
        type: Sequelize.STRING
      },
      role: {
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
    await queryInterface.dropTable('Pegawais');
  }
};