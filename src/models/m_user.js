'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      m_user.belongsTo(models.m_cabang, {
        foreignKey: 'mCabangId',
        as: 'cabang',
      });
      m_user.belongsTo(models.m_divisi, {
        foreignKey: 'mDivisiId',
        as: 'divisi',
      });
    }
  }
  m_user.init({
    name: DataTypes.STRING,
    nip: {
      type: DataTypes.STRING,
      unique: true, // 👉 tambahin ini
    },
    password: DataTypes.STRING,
    mCabangId: DataTypes.INTEGER,
    mDivisiId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'm_user',
  });
  return m_user;
};