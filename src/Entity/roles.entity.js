// This file defines the Role entity schema for TypeORM.

// const { EntitySchema } = require("typeorm");

// const Role = new EntitySchema({
//   name: "Role",
//   tableName: "roles",
//   columns: {
//     id: {
//       primary: true,
//       type: "int",
//       generated: true,
//     },
//     name: {
//       type: "varchar",
//       nullable: false,
//       unique: true,
//     },
//     description: {
//       type: "varchar",
//       nullable: true,
//     },
//     created_at: {
//       type: "timestamp",
//       default: () => "CURRENT_TIMESTAMP",
//     },
//   },

//   // Relationships with users.
//   relations: {
//     users: {
//       type: "many-to-many",
//       target: "User",
//       inverseSide: "roles", // do not use joinTable here
//     },
//   },

//   // Relationship with Permission
//   relations:{
//     permissions:{
//       type:"many-to-many",
//       target: "Permission",
//       inverseSide: "roles",
//     }
//   }
   

// });

// module.exports = { Role };


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
    // secondary: {
    //   type: "tinyint",
    //   width: 1,
    //   nullable: false,
    // },
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
