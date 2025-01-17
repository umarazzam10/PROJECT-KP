'use strict';
const {
  Model
} = require('sequelize');
// models/Sisa_Cuti.js
module.exports = (sequelize, DataTypes) => {
  const SisaCuti = sequelize.define('Sisa_Cuti', {
    id_sisa_cuti: {
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
    tahun: DataTypes.INTEGER,
    sisa_cuti: DataTypes.INTEGER
  }, {
    tableName: 'Sisa_Cuti',
    timestamps: false
  });

  SisaCuti.associate = (models) => {
    SisaCuti.belongsTo(models.Pegawai, { foreignKey: 'NIP' });
  };

  return SisaCuti;
};
