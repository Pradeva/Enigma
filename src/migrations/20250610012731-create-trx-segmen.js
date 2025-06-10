'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trx_segmens', {
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
      divisi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      kreditur: {
        type: Sequelize.STRING,
        allowNull: false
      },
      outstanding: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      jenis_produk: {
        type: Sequelize.STRING,
        allowNull: false
      },
      kolektabilitas: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trx_segmens');
  }
};