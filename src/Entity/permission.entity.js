// const { EntitySchema } = require("typeorm");

// const Permission = new EntitySchema({
//   name: "Permission",
//   tableName: "permission",
//   columns: {
//     id: {
//       primary: true,
//       type: "int",
//       generated: true,
//     },
//     name: {
//       type: "varchar",
//       nullable: false,
//     },
//     description: {
//       type: "text",
//       nullable: true,
//     },
//     created_at: {
//       type: "timestamp",
//       createDate: true,
//     },
//     updated_at: {
//       type: "timestamp",
//       updateDate: true,
//     },
//   },

//   // Define the many-to-many relationship with Role
//   relations: {
//     roles: {
//       target: "Role",
//       type: "many-to-many",
//       joinTable: {
//         name: "role_permission",
//         joinColumn: {
//           name: "permission_id",
//           referencedColumnName: "id",
//         },
//         inverseJoinColumn: {
//           name: "role_id",
//           referencedColumnName: "id",
//         },
//       },
//       inverseSide: "permissions",
//     },
//   },
// });

// module.exports = { Permission };





const { EntitySchema } = require("typeorm");

const Permission = new EntitySchema({
  name: "Permission",
  tableName: "permissions", // ✅ match table name exactly
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      length: 155,
      nullable: false,
    },
    slug: {
      type: "varchar",
      length: 155,
      nullable: false,
      unique: true, // ✅ per schema
    },
    permission_group: {
      type: "varchar",
      length: 155,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: true,
    },
    created_at: {
      type: "datetime",
      createDate: true,
    },
    updated_at: {
      type: "datetime",
      updateDate: true,
    },
    deleted_at: {
      type: "datetime",
      nullable: true,
      deleteDate: true, // optional for soft delete support
    },
  },

  relations: {
    roles: {
      target: "Role",
      type: "many-to-many",
      joinTable: {
        name: "role_permission", // ✅ intermediate table
        joinColumn: {
          name: "permission_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "role_id",
          referencedColumnName: "id",
        },
 },
      inverseSide: "permissions",
    },
  },
});

module.exports = { Permission };
