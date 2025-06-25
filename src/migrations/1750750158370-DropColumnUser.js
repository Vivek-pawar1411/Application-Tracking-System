// src/migration/1750750158370-DropColumnUser.js

module.exports = class DropColumnUser1750750158370 {
  name = 'DropColumnUser1750750158370';

  async up(queryRunner) {
    // ❌ Drop "deleted_at" column from all three tables
    await queryRunner.query(`ALTER TABLE user DROP COLUMN deletedAt`);
    await queryRunner.query(`ALTER TABLE roles DROP COLUMN deleted_at`);
    await queryRunner.query(`ALTER TABLE permissions DROP COLUMN deleted_at`);
  }

  async down(queryRunner) {
    // 🔁 Rollback: Add "deleted_at" column back as DATETIME or TIMESTAMP
    await queryRunner.query(`ALTER TABLE user ADD deletedAt DATETIME`);
    await queryRunner.query(`ALTER TABLE roles ADD deleted_at DATETIME`);
    await queryRunner.query(`ALTER TABLE permissions ADD deleted_at DATETIME`);
  }
};
