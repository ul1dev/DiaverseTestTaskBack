'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Paginations', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      items: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      pageItemsCount: {
        type: Sequelize.INTEGER,
        defaultValue: 20,
      },
      rowLen: {
        type: Sequelize.INTEGER,
        defaultValue: 20,
      },
      isEmptyFill: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isShowCount: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      dontHideNavbar: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
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
      BEFORE UPDATE ON "Paginations"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON "Paginations";
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);
    await queryInterface.dropTable('Paginations');
  },
};
