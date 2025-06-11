'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trx_pengurus_loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pengurus_nasabah_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'm_pengurus_nasabahs',
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
      suku_bunga: {
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
    await queryInterface.dropTable('trx_pengurus_loans');
  }
};