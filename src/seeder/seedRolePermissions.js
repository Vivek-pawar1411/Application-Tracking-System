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

  const hr = await roleRepo.findOne({
    where: { id: 3 },
    relations: ["permissions"],
  });

  if (!masterAdmin || !superAdmin || !hr) {
    throw new Error("❌ One or more required roles (master-admin, super-admin, hr) not found.");
  }

  // Fetch all permissions
  const allPermissions = await permissionRepo.find();

  // Assign all permissions to Master Admin
  masterAdmin.permissions = allPermissions;
  await roleRepo.save(masterAdmin);
  console.log("✅ Assigned all permissions to Master Admin");

  // Assign all permissions to Super Admin
  superAdmin.permissions = allPermissions;
  await roleRepo.save(superAdmin);
  console.log("✅ Assigned all permissions to Super Admin");

  // Assign Job CRUD permissions to HR
  const jobPermissions = allPermissions.filter(
    (perm) => perm.permission_group.toLowerCase() === "job"
  );

  hr.permissions = jobPermissions;
  await roleRepo.save(hr);
  console.log("✅ Assigned Job CRUD permissions to HR (id = 3)");
}

module.exports = seedRolePermissions;
