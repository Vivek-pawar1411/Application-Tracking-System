const { EntitySchema } = require("typeorm");

const Token = new EntitySchema({
  name: "Token",
  tableName: "tokens",
  columns: {
    id: { primary: true, type: "int", generated: true },
    token: { type: "text" },
    userId: { type: "int" },
    isBlacklisted: { type: "boolean", default: false },
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    expiresAt: { type: "timestamp" },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      onDelete: "CASCADE",
    },
  },
});

module.exports = {Token};
