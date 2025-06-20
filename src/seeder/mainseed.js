const { AppDataSource } = require('../database/db');
const seedRoles = require('./seedRoles');
const seedUser = require('./seeduser');
const seedPermissions=require('./seedpermission')
const seedRolePermissions=require('./seedRolePermissions')

async function runAllSeeders() {
  try {
    await AppDataSource.initialize();
    console.log("📡 Database connected");

    console.log("🔁 Starting role seeding...");
    await seedRoles();

    console.log("🔁 Starting user seeding...");
    await seedUser();

    console.log("🔁 Starting permission seeding...");
    await seedPermissions();

    console.log("🔁 Starting role permissions seeding...");
    await seedRolePermissions();

    console.log("✅ All seeders executed successfully.");
  } catch (error) {
    console.error("❌ Error executing seeders:", error);
  } finally {
    await AppDataSource.destroy();
    console.log("🛑 Database connection closed");
  }
}

runAllSeeders();
