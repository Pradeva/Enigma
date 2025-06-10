'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trx_company_non_cash_loans', {
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
      kreditur_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'm_krediturs',
          key: 'id',
        },
      },
      plafond: {
        type: Sequelize.STRING
      },
      outstanding: {
        type: Sequelize.STRING
      },
      tanggal_mulai: {
        type: Sequelize.STRING
      },
      tanggal_akhir: {
        type: Sequelize.STRING
      },
      jenis_kredit: {
        type: Sequelize.STRING
      },
      agunan: {
        type: Sequelize.STRING
      },
      kolektabilitas: {
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
    await queryInterface.dropTable('trx_company_non_cash_loans');
  }
};