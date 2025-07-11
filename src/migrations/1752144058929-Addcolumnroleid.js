const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Addcolumnroleid1752144058929 {
  name = 'Addcolumnroleid1752144058929';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE \`roles\` ADD \`roleid\` int NOT NULL`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`roleid\``);
  }
};
