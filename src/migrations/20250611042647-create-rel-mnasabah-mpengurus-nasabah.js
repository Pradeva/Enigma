'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rel_mnasabah_mpengurus_nasabahs', {
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
      pengurus_nasabah_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'm_pengurus_nasabahs',
          key: 'id',
        },
      },
      jabatan: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('rel_mnasabah_mpengurus_nasabahs');
  }
};