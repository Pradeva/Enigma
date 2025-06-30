'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trx_kolektabilitas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      trx_kolektabilitas.belongsTo(models.m_nasabah, {
        foreignKey: 'nasabah_id',
        as: 'nasabah',
      });
    }
  }
  trx_kolektabilitas.init({
    nasabah_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loan_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status_kolek: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tanggal_kolek: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dpd: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'trx_kolektabilitas',
  });
  return trx_kolektabilitas;
};