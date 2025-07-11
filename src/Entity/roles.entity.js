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
    roleid:{
      type: "int",
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
      joinTable: {
        name: "role_permission",
        joinColumn: {
          name: "role_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "permission_id",
          referencedColumnName: "id",
        },
      },
      inverseSide: "roles",
      cascade: true,
      eager: true, // Optional: load permissions automatically
    },
  },
});

module.exports = { Role };
