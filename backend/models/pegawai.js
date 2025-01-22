'use strict';
const {
  Model
} = require('sequelize');
// models/Pegawai.js
module.exports = (sequelize, DataTypes) => {
  const Pegawai = sequelize.define('Pegawai', {
    NIP: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    nama: DataTypes.STRING,
    password: DataTypes.STRING,
    pangkat_golongan: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    satuan_organisasi: DataTypes.STRING,
    jumlah_hak: DataTypes.INTEGER,
    unit_kerja: DataTypes.STRING,
    tingkat_eselon: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    tableName: 'Pegawai',
    timestamps: false
  });

  Pegawai.associate = (models) => {
    Pegawai.hasMany(models.Sisa_Cuti, { foreignKey: 'NIP' });
    Pegawai.hasMany(models.Permintaan_Cuti, { foreignKey: 'NIP' });
    Pegawai.hasMany(models.Surat_Izin_Cuti, { foreignKey: 'id_pejabat' });
  };

  return Pegawai;
};
