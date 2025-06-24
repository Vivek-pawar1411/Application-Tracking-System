module.exports = class DropStatusAndCountryCode1750743822630 {
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE user DROP COLUMN status`);
    await queryRunner.query(`ALTER TABLE user DROP COLUMN countryCode`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE user ADD COLUMN status BOOLEAN DEFAULT true`);
    await queryRunner.query(`ALTER TABLE user ADD COLUMN countryCode VARCHAR(10)`);
  }
};
