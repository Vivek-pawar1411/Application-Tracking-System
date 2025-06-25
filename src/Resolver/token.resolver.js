const { AppDataSource } = require("../database/db");
const { Token } = require("../Entity/token.entity");
const { User } = require("../Entity/user.entity");
const jwt = require("jsonwebtoken");

const tokenResolvers = {
  Query: {
    alltoken: async () => {
      const repo = AppDataSource.getRepository(Token);
      return await repo.find();
    },
    tokenById: async (_, { userId }) => {
      const repo = AppDataSource.getRepository(Token);
      return await repo.find({ where: { userId } });
    },
  },
}

module.exports = tokenResolvers;
