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
      length: 150,
      nullable: false,
    },
    slug: {
      type: "varchar",
      length: 150,
      nullable: false,
      unique: true,
    },
    description: {
      type: "text",
      nullable: true,
    },
    status: {
      type: "tinyint",
      width: 1,
      nullable: false,
    },
    userType: {
      type: "varchar",
      length: 155,
      nullable: false,
    },
    created_at: {
      type: "datetime",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "datetime",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
    deleted_at: {
      type: "datetime",
      nullable: true,
    },
  },

  relations: {
    users: {
      type: "many-to-many",
      target: "User",
      inverseSide: "roles",
    },
    permissions: {
      type: "many-to-many",
      target: "Permission",
      inverseSide: "roles",
    },
  },
});

module.exports = { Role };
