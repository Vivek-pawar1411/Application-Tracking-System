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
    firstName: { // added field
      type: "varchar",
      length: 80,
      nullable: false,
    },
    lastName: { // added field
      type: "varchar",
      length: 80,
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
    countryCode: { // added field
      type: "varchar",
      length: 120,
      nullable: false,
    },
    mobileNo: { // added field
      type: "bigint",
      nullable: false,
      unique: true,
    },
    userType: { // added field
      type: "varchar",
      length: 120,
      nullable: false,
      default: "user",
    },
    status: { // added field
      type: "boolean",
      default: true,
    },
    is_blocked: { // added field
      type: "boolean",
      nullable: false,
      default: false,
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
    updated_at: { // added field
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
    deletedAt: { // added field
      type: "timestamp",
      nullable: true,
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
