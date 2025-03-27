'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mailings', {
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
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'CREATING',
      },
      chatId: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      messageId: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      text: Sequelize.STRING(700),
      animationFileId: Sequelize.STRING(500),
      audioFileId: Sequelize.STRING(500),
      documentFileId: Sequelize.STRING(500),
      videoFileId: Sequelize.STRING(500),
      photoFileId: Sequelize.STRING(500),
      voiceFileId: Sequelize.STRING(500),
      stickerFileId: Sequelize.STRING(500),
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
      BEFORE UPDATE ON "Mailings"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON "Mailings";
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);
    await queryInterface.dropTable('Mailings');
  },
};
