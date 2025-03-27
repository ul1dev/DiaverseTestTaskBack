'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChainFields', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      chainId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      serNum: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(100),
        defaultValue: 'text',
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      cancelBtnCallbackData: {
        type: Sequelize.STRING(100),
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      isSkip: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isSkipped: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      userResponse: Sequelize.BLOB,
      validations: Sequelize.TEXT,
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
      BEFORE UPDATE ON "ChainFields"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON "ChainFields";
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);
    await queryInterface.dropTable('ChainFields');
  },
};
