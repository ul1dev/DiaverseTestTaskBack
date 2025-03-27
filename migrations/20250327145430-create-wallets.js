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
      BEFORE UPDATE ON "Wallets"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON "Wallets";
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);
    await queryInterface.dropTable('Wallets');
  },
};
