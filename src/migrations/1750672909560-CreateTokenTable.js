/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTokenTable1750672909560 {
    name = 'CreateTokenTable1750672909560'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` text NOT NULL, \`userId\` int NOT NULL, \`isBlacklisted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`expiresAt\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tokens\` ADD CONSTRAINT \`FK_d417e5d35f2434afc4bd48cb4d2\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`tokens\` DROP FOREIGN KEY \`FK_d417e5d35f2434afc4bd48cb4d2\``);
        await queryRunner.query(`DROP TABLE \`tokens\``);
    }
}
