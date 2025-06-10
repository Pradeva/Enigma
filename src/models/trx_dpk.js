'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trx_dpk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      trx_dpk.belongsTo(models.m_nasabah, {
        foreignKey: 'nasabah_id',
        as: 'nasabah',
      });
      trx_dpk.belongsTo(models.ref_jenis_dpk, {
        foreignKey: 'jenis_dpk_id',
        as: 'jenis_dpk',
      });
    }
  }
  trx_dpk.init({
    nasabah_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jenis_dpk_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rek: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nominal: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    jenis_produk: {
      type: DataTypes.STRING,
      allowNull: true, 
    }
  }, {
    sequelize,
    modelName: 'trx_dpk',
    // underscored: true,
    // timestamps: false, // <== tambahkan ini
  });
  return trx_dpk;
};