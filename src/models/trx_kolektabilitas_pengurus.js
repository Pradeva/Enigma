'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trx_kolektabilitas_pengurus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      trx_kolektabilitas_pengurus.belongsTo(models.m_pengurus_nasabah, {
        foreignKey: 'pengurus_nasabah_id',
        as: 'pengurus_nasabah',
      });
    }
  }
  trx_kolektabilitas_pengurus.init({
    pengurus_nasabah_id: {
      type: DataTypes.INTEGER,
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
  }, {
    sequelize,
    modelName: 'trx_kolektabilitas_pengurus',
  });
  return trx_kolektabilitas_pengurus;
};