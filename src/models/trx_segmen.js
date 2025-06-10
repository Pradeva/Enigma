'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trx_segmen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      trx_segmen.belongsTo(models.m_nasabah, {
        foreignKey: 'nasabah_id',
        as: 'nasabah',
      });
    }
  }
  trx_segmen.init({
    nasabah_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    divisi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kreditur: {
      type: DataTypes.STRING,
      allowNull: false
    },
    outstanding: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    jenis_produk: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kolektabilitas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'trx_segmen',
  });
  return trx_segmen;
};