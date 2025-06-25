const { AppDataSource } = require('../database/db');
const seedRoles = require('./seedRoles');
const seedUser = require('./seeduser');
const seedPermissions=require('./seedPermission')
const seedRolePermissions=require('./seedRolePermissions')

async function runAllSeeders() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("📡 Database connected");
    }

    console.log("🔁 Starting Role seeding...");
    await seedRoles();

    console.log("🔁 Starting User seeding...");
    await seedUser();

    console.log("🔁 Starting permission seeding...");
    await seedPermissions();

    console.log("🔁 Starting role permissions seeding...");
    await seedRolePermissions();

    console.log("✅ All seeders executed successfully.");
  } catch (error) {
    console.error("❌ Error executing seeders:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🛑 Database connection closed");
    }
    process.exit(0); // ✅ Exit cleanly
  }
}

runAllSeeders();
