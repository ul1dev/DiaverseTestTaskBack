'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MailingQueueItems', {
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
      mailingId: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      serialNum: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
      BEFORE UPDATE ON "MailingQueueItems"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON "MailingQueueItems";
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);
    await queryInterface.dropTable('MailingQueueItems');
  },
};
