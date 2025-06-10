'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class m_nasabah extends Model {
    static associate(models) {
      m_nasabah.hasMany(models.trx_dpk, {
        foreignKey: 'nasabah_id',
        as: 'dpk',
      });
    }
  }

  m_nasabah.init({
    nama: DataTypes.STRING,
    NPWP: {
      type: DataTypes.STRING,
      unique: true,
    },
    CIF: {
      type: DataTypes.STRING,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'm_nasabah',
  });

  return m_nasabah;
};
