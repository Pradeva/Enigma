'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trx_dpks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nasabah_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'm_nasabahs',
          key: 'id',
        },
      },
      jenis_dpk_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ref_jenis_dpks',
          key: 'id',
        },
      },
      rek: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nominal: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      jenis_produk: {
        type: Sequelize.STRING,
        
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trx_dpks');
  }
};