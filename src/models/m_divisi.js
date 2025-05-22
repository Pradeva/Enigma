'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_divisi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      m_divisi.hasMany(models.m_user, {
        foreignKey: 'mDivisiId',
        as: 'users',
      });
    }
  }
  m_divisi.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'm_divisi',
  });
  return m_divisi;
};