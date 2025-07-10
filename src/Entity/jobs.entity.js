const { EntitySchema } = require('typeorm');

const Jobs = new EntitySchema({
  name: "Job",
  tableName: "jobs",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: false,
    },
    department: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    location: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    experience: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    salary: {
      type: "decimal",
      precision: 10,
      scale: 3,
      nullable: false,
    },
    vacancy: {
      type: "int",
      nullable: false,
    },
    status: {
      type: "boolean",
    },
    posted_date: {
      type: "timestamp",
      nullable: false,
    },
    closing_date: {
      type: "timestamp",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },

  relations: {
    created_by: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "created_by", // column name in the jobs table
        referencedColumnName: "id"
      },
      nullable: false,
      eager: true
    }
  }
});

module.exports = { Jobs };
