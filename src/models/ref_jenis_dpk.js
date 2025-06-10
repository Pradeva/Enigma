'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ref_jenis_dpk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ref_jenis_dpk.hasMany(models.trx_dpk, {
        foreignKey: 'jenis_dpk_id',
        as: 'trx_dpk',
      });
    }
  }
  ref_jenis_dpk.init({
    kode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ref_jenis_dpk',
    // underscored: true,
    // timestamps: false, // <== tambahkan ini
  });
  return ref_jenis_dpk;
};