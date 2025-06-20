module.exports = class UpdateUserTable1750259504831 {
  name = 'UpdateUserTable1750259504831';

  async up(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS \`user\``);

    await queryRunner.query(`
      CREATE TABLE \`user\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`email\` VARCHAR(255) NOT NULL,
        \`password\` VARCHAR(255) NOT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`otp\` VARCHAR(255),
        \`otpExpiry\` TIMESTAMP NULL,
        \`isverified\` TINYINT NOT NULL DEFAULT 0,
        \`firstName\` VARCHAR(80) NOT NULL,
        \`lastName\` VARCHAR(80) NOT NULL,
        \`countryCode\` VARCHAR(120) NOT NULL,
        \`mobileNo\` BIGINT NOT NULL,
        \`userType\` VARCHAR(120) NOT NULL DEFAULT 'user',
        \`status\` TINYINT NOT NULL DEFAULT 1,
        \`is_blocked\` TINYINT NOT NULL DEFAULT 0,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deletedAt\` TIMESTAMP NULL,
        PRIMARY KEY (\`id\`)
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS \`user\``);
  }
};
