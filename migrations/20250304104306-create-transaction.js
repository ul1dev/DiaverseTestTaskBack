'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.STRING(500),
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(100),
        defaultValue: 'PROCESSING',
      },
      currency: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      count: Sequelize.INTEGER,
      amount: Sequelize.INTEGER,
      productTitle: Sequelize.STRING(255),
      hashHex: Sequelize.STRING(500),
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON "Transactions"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON "Transactions";
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);
    await queryInterface.dropTable('Transactions');
  },
};
