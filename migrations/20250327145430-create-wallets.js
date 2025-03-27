'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Wallets', {
      id: {
        type: Sequelize.STRING(500),
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      publicKey: Sequelize.STRING(500),
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Wallets');
  },
};
