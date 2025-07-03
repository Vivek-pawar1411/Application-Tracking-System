module.exports = class CreateMeetingTable1751364189920 {
  name = 'CreateMeetingTable1751364189920';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE \`meetings\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`agenda\` text NULL,
        \`scheduledAt\` timestamp NOT NULL,
        \`durationMinutes\` int NULL,
        \`location\` varchar(255) NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`created_by\` int NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`meeting_attendees\` (
        \`meeting_id\` int NOT NULL,
        \`user_id\` int NOT NULL,
        INDEX \`IDX_8643679c49d7234b266433bc20\` (\`meeting_id\`),
        INDEX \`IDX_edda203440a111ad016876f873\` (\`user_id\`),
        PRIMARY KEY (\`meeting_id\`, \`user_id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      ALTER TABLE \`meetings\`
      ADD CONSTRAINT \`FK_be6ff3e68963349ea42cf55319e\`
      FOREIGN KEY (\`created_by\`)
      REFERENCES \`user\`(\`id\`)
      ON DELETE SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`meeting_attendees\`
      ADD CONSTRAINT \`FK_8643679c49d7234b266433bc201\`
      FOREIGN KEY (\`meeting_id\`)
      REFERENCES \`meetings\`(\`id\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`meeting_attendees\`
      ADD CONSTRAINT \`FK_edda203440a111ad016876f8737\`
      FOREIGN KEY (\`user_id\`)
      REFERENCES \`user\`(\`id\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE \`meeting_attendees\` DROP FOREIGN KEY \`FK_edda203440a111ad016876f8737\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`meeting_attendees\` DROP FOREIGN KEY \`FK_8643679c49d7234b266433bc201\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`meetings\` DROP FOREIGN KEY \`FK_be6ff3e68963349ea42cf55319e\`
    `);
    await queryRunner.query(`
      DROP INDEX \`IDX_edda203440a111ad016876f873\` ON \`meeting_attendees\`
    `);
    await queryRunner.query(`
      DROP INDEX \`IDX_8643679c49d7234b266433bc20\` ON \`meeting_attendees\`
    `);
    await queryRunner.query(`
      DROP TABLE \`meeting_attendees\`
    `);
    await queryRunner.query(`
      DROP TABLE \`meetings\`
    `);
  }
}
