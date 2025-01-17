'use strict';
const {
  Model
} = require('sequelize');
// models/Permintaan_Cuti.js
module.exports = (sequelize, DataTypes) => {
  const PermintaanCuti = sequelize.define('Permintaan_Cuti', {
    id_permintaan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    NIP: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Pegawai',
        key: 'NIP'
      }
    },
    tanggal_mulai: DataTypes.DATE,
    tanggal_selesai: DataTypes.DATE,
    status: DataTypes.STRING,
    jenis_cuti: DataTypes.STRING,
    keterangan: DataTypes.STRING,
    sisa_cuti_dipakai: DataTypes.INTEGER
  }, {
    tableName: 'Permintaan_Cuti',
    timestamps: false
  });

  PermintaanCuti.associate = (models) => {
    PermintaanCuti.belongsTo(models.Pegawai, { foreignKey: 'NIP' });
  };

  return PermintaanCuti;
};
