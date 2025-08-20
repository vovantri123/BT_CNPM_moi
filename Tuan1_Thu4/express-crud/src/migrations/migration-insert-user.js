'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        email: 'admin@gmail.com',
        password: '123456',    // thường nên hash password
        firstName: 'Admin',
        lastName: 'System',
        address: 'Hà Nội',
        phoneNumber: '0123456789',
        gender: true,
        image: null,
        roleId: '1',
        positionId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'doctor@gmail.com',
        password: '123456',
        firstName: 'John',
        lastName: 'Doe',
        address: 'HCM',
        phoneNumber: '0987654321',
        gender: false,
        image: null,
        roleId: '2',
        positionId: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};