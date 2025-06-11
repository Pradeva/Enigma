'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rel_mnasabah_mpengurus_nasabah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      rel_mnasabah_mpengurus_nasabah.belongsTo(models.m_nasabah, {
        foreignKey: 'nasabah_id',
        as: 'nasabah',
      });
      rel_mnasabah_mpengurus_nasabah.belongsTo(models.m_pengurus_nasabah, {
        foreignKey: 'pengurus_nasabah_id',
        as: 'pengurus_nasabah',
      });
    }
  }
  rel_mnasabah_mpengurus_nasabah.init({
    nasabah_id: DataTypes.INTEGER,
    pengurus_nasabah_id: DataTypes.INTEGER,
    jabatan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'rel_mnasabah_mpengurus_nasabah',
  });
  return rel_mnasabah_mpengurus_nasabah;
};