'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class m_nasabah extends Model {
    static associate(models) {
      m_nasabah.hasMany(models.trx_dpk, {
        foreignKey: 'nasabah_id',
        as: 'dpk',
      });
      m_nasabah.hasMany(models.trx_segmen, {
        foreignKey: 'nasabah_id',
        as: 'segmen',
      });
      m_nasabah.hasMany(models.trx_company_cash_loan, {
        foreignKey: 'nasabah_id',
        as: 'company_cash_loans',
      });
      m_nasabah.hasMany(models.trx_company_non_cash_loan, {
        foreignKey: 'nasabah_id',
        as: 'company_non_cash_loans',
      });
      m_nasabah.hasMany(models.trx_kolektabilitas, {
        foreignKey: 'nasabah_id',
        as: 'kolektabilitas',
      });
      m_nasabah.hasMany(models.rel_mnasabah_mpengurus_nasabah, {
        foreignKey: 'nasabah_id',
        as: 'mnasabah_mpengurus_nasabah',
      })
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
    kota: DataTypes.STRING,
    provinsi: DataTypes.STRING,
    segmentasi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'm_nasabah',
  });

  return m_nasabah;
};
