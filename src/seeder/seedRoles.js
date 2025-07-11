// const { AppDataSource } = require("../database/db");
// const { Role } = require("../Entity/roles.entity");

// async function seedRoles() {
//   const roleRepo = AppDataSource.getRepository(Role);

//   const predefinedRoles = [
//     { name: "Master_Admin", description: " Administrator with full access" },
//     { name: "Super_Admin", description: "Partially access" },
//     // { name: "Interviewer", description: "Interviewer Role" },
//     // { name: "Candidate", description: "Candidate applying for jobs" },
//   ];

//   for (const roleData of predefinedRoles) {
//     const existing = await roleRepo.findOneBy({ name: roleData.name });
//     if (!existing) {
//       const role = roleRepo.create(roleData);
//       await roleRepo.save(role);
//       console.log(`Inserted role: ${roleData.name}`);
//     } else {
//       console.log(`Role already exists: ${roleData.name}`);
//     }
//   }

//   console.log("Role seeding completed.");
// }

// module.exports = seedRoles;

const { AppDataSource } = require("../database/db");
const { Role } = require("../Entity/roles.entity");

async function seedRoles() {
  const roleRepo = AppDataSource.getRepository(Role);

  const predefinedRoles = [
    {
      name: "Master Admin",
      roleid: 1,
      description: "Full system control access for Master Admin",
      slug: "master-admin",
      status: true,
      userType: "master_admin",
    },
    {
      name: "Super Admin",
      roleid: 2,
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

