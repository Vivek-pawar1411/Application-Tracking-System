const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddOtpFieldsToUser1750071152173 {
  name = 'AddOtpFieldsToUser1750071152173';

  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE user 
      ADD otp VARCHAR(255) NULL,
      ADD otpExpiry TIMESTAMP NULL,
      ADD isverified BOOLEAN NOT NULL DEFAULT false
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE user 
      DROP COLUMN isverified,
      DROP COLUMN otpExpiry,
      DROP COLUMN otp
    `);
  }
};
