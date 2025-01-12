const { DataTypes } = require('sequelize')

'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('machines', 'service_date', {
      type: DataTypes.DATE,
      allowNull: true
    });
    //  * Example:
    //  * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
  },

  async down (queryInterface, Sequelize) {
    //  * Example:
    //  * await queryInterface.dropTable('users');
    await queryInterface.removeColumn('machines', 'service_date');
  }
};
