
module.exports = class AddExpiresColumnToTokens1750839060098 {
  name = 'AddExpiresColumnToTokens1750839060098';

 
  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE tokens ADD COLUMN expires BOOLEAN DEFAULT false;
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE tokens DROP COLUMN expires;
    `);
  }
};
