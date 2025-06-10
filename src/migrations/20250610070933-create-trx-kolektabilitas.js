'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trx_kolektabilitas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nasabah_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'm_nasabahs',
          key: 'id',
        },
      },
      loan_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      loan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status_kolek: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tanggal_kolek: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('trx_kolektabilitas');
  }
};