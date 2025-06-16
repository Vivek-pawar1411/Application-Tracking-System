// This file defines the User entity schema for TypeORM.
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
    otp: {
      type: "varchar",
      nullable: true,
    },
    otpExpiry: {
      type: "timestamp",
      nullable: true,
    },
    isverified: {
      type: "boolean",
      default: false,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },

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
      eager: true,
    },
  },
});

module.exports = { User };
