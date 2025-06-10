'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trx_company_non_cash_loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      trx_company_non_cash_loan.belongsTo(models.m_nasabah, {
        foreignKey: 'nasabah_id',
        as: 'nasabah',
      });
      trx_company_non_cash_loan.belongsTo(models.m_kreditur, {
        foreignKey: 'kreditur_id',
        as: 'kreditur',
      });
    }
  }
  trx_company_non_cash_loan.init({
    nasabah_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kreditur_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plafond: {
      type: DataTypes.STRING,
      allowNull: false
    },
    outstanding: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tanggal_mulai: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tanggal_akhir: {
      type: DataTypes.STRING,
      allowNull: false
    },
    jenis_kredit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    agunan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kolektabilitas: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'trx_company_non_cash_loan',
  });
  return trx_company_non_cash_loan;
};