module.exports = class CreateJobsTable1750839966701 {
  name = 'CreateJobsTable1750839966701';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE \`jobs\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`description\` text NOT NULL,
        \`department\` varchar(100) NOT NULL,
        \`location\` varchar(100) NOT NULL,
        \`experience\` varchar(50) NOT NULL,
        \`salary\` decimal(10,3) NOT NULL,
        \`vacancy\` int NOT NULL,
        \`status\` tinyint NOT NULL,
        \`posted_date\` timestamp NOT NULL,
        \`closing_date\` varchar(150) NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`created_by\` int NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      ALTER TABLE \`tokens\`
      CHANGE \`expires\` \`expires\` tinyint NOT NULL DEFAULT 0;
    `);

    await queryRunner.query(`
      ALTER TABLE \`jobs\`
      ADD CONSTRAINT \`FK_2d210533bd8823b36702a26dd43\`
      FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE \`jobs\`
      DROP FOREIGN KEY \`FK_2d210533bd8823b36702a26dd43\`;
    `);

    await queryRunner.query(`
      ALTER TABLE \`tokens\`
      CHANGE \`expires\` \`expires\` tinyint(1) NULL DEFAULT '0';
    `);

    await queryRunner.query(`
      DROP TABLE \`jobs\`;
    `);
  }
};
