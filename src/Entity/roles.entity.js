// This file defines the Role entity schema for TypeORM.

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

  // Relationships with users.
  relations: {
    users: {
      type: "many-to-many",
      target: "User",
      inverseSide: "roles", // do not use joinTable here
    },
  },

  // Relationship with Permission
  relations:{
    permissions:{
      type:"many-to-many",
      target: "Permission",
      inverseSide: "roles",
    }
  }
   

});

module.exports = { Role };
