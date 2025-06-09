const { EntitySchema } = require("typeorm");

const Role = new EntitySchema({
  name: "Role",
  tableName: "roles",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    description: {
      type: "varchar",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    users: {
      type: "many-to-many",
      target: "User",
      inverseSide: "roles", // do not use joinTable here
    },
  },
});

module.exports = { Role };
