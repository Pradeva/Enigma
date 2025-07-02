'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class m_search_history extends Model {
    /**
     * Helper method for defining associations.
     * (kosong karena gak ada relasi)
     */
    static associate(models) {
      // No associations
    }
  }

  m_search_history.init({
    user_id: DataTypes.INTEGER,
    nasabah_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'm_search_history',
    tableName: 'm_search_histories',
    createdAt: 'created_at',    // 🟢 mapping ke kolom di DB
    updatedAt: 'updated_at'
  });

  return m_search_history;
};
