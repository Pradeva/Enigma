'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_pengurus_nasabah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      m_pengurus_nasabah.hasMany(models.rel_mnasabah_mpengurus_nasabah, {
        foreignKey: 'pengurus_nasabah_id',
        as: 'mnasabah_mpengurus_nasabah',
      })
    }
  }
  m_pengurus_nasabah.init({
    nama: DataTypes.STRING,
    NIK: DataTypes.STRING,
    NPWP: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'm_pengurus_nasabah',
  });
  return m_pengurus_nasabah;
};