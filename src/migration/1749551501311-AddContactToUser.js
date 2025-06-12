/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */

const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddContactToUser1749551501311 {
    name = 'AddContactToUser1749551501311'

        async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE user ADD contact varchar(255) NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE user DROP COLUMN contact`);
    }
};

