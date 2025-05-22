'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_cabang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      m_cabang.hasMany(models.m_user, {
        foreignKey: 'mCabangId',
        as: 'users',
      });
    }
  }
  m_cabang.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'm_cabang',
  });
  return m_cabang;
};