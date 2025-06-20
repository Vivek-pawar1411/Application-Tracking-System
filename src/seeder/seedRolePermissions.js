const { AppDataSource } = require("../database/db");
const { Role } = require("../Entity/roles.entity");
const { Permission } = require("../Entity/permission.entity");

async function seedRolePermissions() {
  const roleRepo = AppDataSource.getRepository(Role);
  const permissionRepo = AppDataSource.getRepository(Permission);

  // Fetch roles
  const masterAdmin = await roleRepo.findOne({
    where: { slug: "master-admin" },
    relations: ["permissions"],
  });

  const superAdmin = await roleRepo.findOne({
    where: { slug: "super-admin" },
    relations: ["permissions"],
  });

  if (!masterAdmin || !superAdmin) {
    throw new Error("❌ Required roles not found.");
  }

  // Fetch all permissions
  const allPermissions = await permissionRepo.find();

  // Assign all permissions to Master Admin
  masterAdmin.permissions = allPermissions;
  await roleRepo.save(masterAdmin);
  console.log("✅ Assigned all permissions to Master Admin");

  // Assign  permissions to Super Admin
   superAdmin.permissions = allPermissions;
  await roleRepo.save(superAdmin);
  console.log("✅ Assigned  permission to Super Admin");
}

module.exports = seedRolePermissions;
