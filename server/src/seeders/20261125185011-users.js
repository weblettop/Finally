'use strict';
const bcrypt = require('bcrypt');
const CONSTANTS = require('../constants');

const PASSWORD = '123456';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash(PASSWORD, CONSTANTS.SALT_ROUNDS);

    return queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Creator',
          lastName: 'Test',
          displayName: 'creator',
          password,
          email: 'creator@gmail.com',
          role: CONSTANTS.CREATOR,
        },
        {
          firstName: 'Customer',
          lastName: 'Test',
          displayName: 'customer',
          password,
          email: 'customer@gmail.com',
          role: CONSTANTS.CUSTOMER,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      'Users',
      { email: ['creator@gmail.com', 'customer@gmail.com'] },
      {}
    );
  },
};
