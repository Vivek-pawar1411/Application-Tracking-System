// import { MigrationInterface, QueryRunner } from "typeorm";

// export class RemoveSecondaryColumn1750329953847 implements MigrationInterface {

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE roles DROP COLUMN secondary`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE roles ADD COLUMN secondary TINYINT(1) NOT NULL`);
//     }

// }

module.exports = class RemoveSecondaryColumn1750329953847 {
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE roles DROP COLUMN secondary`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE roles ADD COLUMN secondary TINYINT(1) NOT NULL`);
  }
};

