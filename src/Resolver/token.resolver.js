const { AppDataSource } = require("../database/db");
const { Token } = require("../Entity/token.entity");
const { User } = require("../Entity/user.entity");
const jwt = require("jsonwebtoken"); // ✅ Required for decoding token

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
    const tokenRepo = AppDataSource.getRepository(Token);
    const userRepo = AppDataSource.getRepository(User);

    // 1. Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.SECRET_KEY || "superkey");
      console.log("✅ Token verified, user ID:", payload.id);
    } catch (err) {
      console.error("❌ Invalid token in logout:", err.message);
      return { success: false, message: "Invalid or expired token" };
    }

    // 2. Find and blacklist token
    const tokenEntry = await tokenRepo.findOne({ where: { token } });
    if (!tokenEntry) {
      return { success: false, message: "Token not found" };
    }

    tokenEntry.isBlacklisted = true;
    await tokenRepo.save(tokenEntry);

    // 3. Update user status and verification
    const user = await userRepo.findOne({ where: { id: payload.id } });
    if (user) {
      user.status = false;
      user.isverified = false;
      await userRepo.save(user);
    }

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("❌ Logout mutation failed:", error.message);
    return { success: false, message: "Logout failed" };
  }
}
  },
};

module.exports = tokenResolvers;
