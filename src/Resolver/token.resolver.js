const { AppDataSource } = require("../database/db");
const { Token } = require("../Entity/token.entity");

const tokenResolvers = {
  Query: {
    alltoken: async () => {
      try {
        console.log("➡️ alltoken resolver called");
        const repo = AppDataSource.getRepository(Token);
        const tokens = await repo.find();
        console.log("✅ Tokens found:", tokens);
        return tokens;
      } catch (err) {
        console.error("❌ Error in alltoken:", err);
        return [];
      }
    },

    tokenById: async (_, { userId }) => {
      try {
        console.log(`➡️ tokenById resolver called for userId: ${userId}`);
        const repo = AppDataSource.getRepository(Token);
        const id = parseInt(userId);
        if (isNaN(id)) throw new Error("Invalid userId");
        const tokens = await repo.find({ where: { userId: id } });
        console.log("✅ Tokens found for userId:", tokens);
        return tokens;
      } catch (err) {
        console.error("❌ Error in tokenById:", err);
        return [];
      }
    },
  },

  Mutation: {
    logout: async (_, { token }) => {
      try {
        const repo = AppDataSource.getRepository(Token);
        const existingToken = await repo.findOne({ where: { token } });

        if (!existingToken) {
          throw new Error("Token not found");
        }

        const now = new Date();
        const tokenExpiration = new Date(existingToken.expiresAt);

        // Mark token as expired if user logs out before expiration
        if (now < tokenExpiration) {
          existingToken.expires = true;
        }

        existingToken.isBlacklisted = true;
        await repo.save(existingToken);

        return {
          success: true,
          message: "Logout successful",
        };
      } catch (error) {
        console.error("Logout error:", error);
        return {
          success: false,
          message: "Logout failed: " + error.message,
        };
      }
    }
  }
};

module.exports = tokenResolvers;
