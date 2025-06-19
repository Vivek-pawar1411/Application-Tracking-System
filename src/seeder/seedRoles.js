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
      name: "Master_Admin",
      slug: "master-admin",
      description: "Administrator with full access",
      secondary: false,
      status: true,
      userType: "admin",
    },
    {
      name: "Super_Admin",
      slug: "super-admin",
      description: "Partially access",
      secondary: false,
      status: true,
      userType: "admin",
    },
    // Add more roles as needed
  ];

  for (const roleData of predefinedRoles) {
    const existing = await roleRepo.findOneBy({ name: roleData.name });
    if (!existing) {
      const role = roleRepo.create(roleData);
      await roleRepo.save(role);
      console.log(`Inserted role: ${roleData.name}`);
    } else {
      console.log(`Role already exists: ${roleData.name}`);
    }
  }

  console.log("Role seeding completed.");
}

module.exports = seedRoles;

