'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_kreditur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      m_kreditur.hasMany(models.trx_company_cash_loan, {
        foreignKey: 'kreditur_id',
        as: 'company_cash_loans',
      });
      m_kreditur.hasMany(models.trx_company_non_cash_loan, {
        foreignKey: 'kreditur_id',
        as: 'company_non_cash_loans',
      });
    }
  }
  m_kreditur.init({
    nama_kreditur: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'm_kreditur',
  });
  return m_kreditur;
};