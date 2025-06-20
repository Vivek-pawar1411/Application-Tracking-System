const { AppDataSource } = require("../database/db");
const { Role } = require("../Entity/roles.entity");

async function seedRoles() {
  const roleRepo = AppDataSource.getRepository(Role);

  const predefinedRoles = [
    {
      name: "Master Admin",
      description: "Full system control access for Master Admin",
      slug: "master-admin",
      status: true,
      userType: "master_admin",
    },
    {
      name: "Super Admin",
      description: "System-wide administrative privileges",
      slug: "super-admin",
      status: true,
      userType: "super_admin",
    },
  ];

  for (const roleData of predefinedRoles) {
    const existing = await roleRepo.findOneBy({ slug: roleData.slug });
    if (!existing) {
      const role = roleRepo.create(roleData);
      await roleRepo.save(role);
      console.log(`✅ Inserted role: ${roleData.name}`);
    } else {
      console.log(`ℹ️ Role already exists: ${roleData.name}`);
    }
  }

  console.log("🚀 Role seeding completed.");
}

module.exports = seedRoles;
