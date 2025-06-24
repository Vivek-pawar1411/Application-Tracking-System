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
  const tokenRepo = AppDataSource.getRepository(Token);
  const userRepo = AppDataSource.getRepository(User);

  try {
    // 1. Verify JWT token
    let payload;
    try {
      payload = jwt.verify(token, process.env.SECRET_KEY || "superkey");
      console.log("✅ Token verified, user ID:", payload.id);
    } catch (err) {
      console.error("❌ Invalid token in logout:", err.message);
      return { success: false, message: "Invalid or expired token" };
    }

    const userId = payload.id;

    // 2. Blacklist all tokens of this user (logout from all sessions)
    await tokenRepo.update(
      { userId, isBlacklisted: false },
      { isBlacklisted: true }
    );
    console.log(`🔒 All tokens for user ${userId} have been blacklisted`);

    // 3. Optional: Update user status
    const user = await userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.status = false;
      user.isverified = false;
      await userRepo.save(user);
      console.log(`🔄 User ${userId} status set to inactive`);
    }

    return {
      success: true,
      message: "Logged out from all sessions successfully",
    };
  } catch (error) {
    console.error("❌ Logout mutation failed:", error.message);
    return {
      success: false,
      message: error.message || "Unexpected error during logout",
    };
  }
}
  },
};

module.exports = tokenResolvers;
