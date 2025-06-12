
// This file defines the User entity schema for TypeORM.
// Description: This file defines the User entity schema for TypeORM.
const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "user",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    email: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    contact: {
      type: "varchar",
      nullable: true,
    },
    
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },


  //relationships with roles.
  // The user can have multiple roles, and roles can be assigned to multiple users.
  relations: {
    roles: {
      type: "many-to-many",
      target: "Role",
      inverseSide: "users",
      joinTable: {
        name: "user_roles",
        joinColumn: {
          name: "user_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "role_id",
          referencedColumnName: "id",
        },
      },
      eager: true, // optional: loads roles automatically with user
    },
  },
});

module.exports = { User };
