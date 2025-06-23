const cron = require("node-cron");
const { AppDataSource } = require("../database/db");
const { Token } = require("../Entity/token.entity");

cron.schedule("0 * * * *", async () => {
  try {
    if (!AppDataSource.isInitialized) {
      console.log("⚠️ Skipping token cleanup: DB not initialized yet");
      return;
    }

    const repo = AppDataSource.getRepository(Token);
    const now = new Date();

    const result = await repo
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where("expiresAt < :now", { now })
      .execute();

    if (result.affected > 0) {
      console.log(`🧹 ${result.affected} expired tokens cleaned at ${now.toISOString()}`);
    }
  } catch (err) {
    console.error("❌ Token cleanup failed:", err.message);
  }
});
