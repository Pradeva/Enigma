'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('m_users', {
      fields: ['nip'],
      type: 'unique',
      name: 'unique_nip_constraint' // kasih nama biar gampang rollback
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('m_users', 'unique_nip_constraint');
  }
};
