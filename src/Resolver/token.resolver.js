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

  Mutation: {
    logout: async (_, { token }) => {
      try {
        const repo = AppDataSource.getRepository(Token);

        // Check if token exists
        const existingToken = await repo.findOne({ where: { token } });

        if (!existingToken) {
          throw new Error("Token not found");
        }

        // Blacklist the token
        existingToken.isBlacklisted = true;
        await repo.save(existingToken);

        return true;
      } catch (error) {
        console.error("Logout error:", error);
        return false;
      }
    },
  },
};

module.exports = tokenResolvers;
