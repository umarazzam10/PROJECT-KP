'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const SuratIzinCuti = sequelize.define('Surat_Izin_Cuti', {
    id_surat: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_permintaan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Permintaan_Cuti',
        key: 'id_permintaan'
      }
    },
    id_pejabat: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Pegawai',
        key: 'NIP'
      }
    },
    nomor_surat: DataTypes.STRING,
    tanggal_terbit: DataTypes.DATE,
    keterangan: DataTypes.STRING,
    tembusan: DataTypes.STRING
  }, {
    tableName: 'Surat_Izin_Cuti',
    timestamps: false
  });

  SuratIzinCuti.associate = (models) => {
    SuratIzinCuti.belongsTo(models.Permintaan_Cuti, { foreignKey: 'id_permintaan' });
    SuratIzinCuti.belongsTo(models.Pegawai, { foreignKey: 'id_pejabat' });
  };

  return SuratIzinCuti;
};