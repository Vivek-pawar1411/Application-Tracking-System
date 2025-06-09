
const{AppDataSource}=require("../database/db"); // Adjust path if needed
const { Role } = require("../Entity/roles.entity"); // Adjust path if needed

async function seedRoles() {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();

    const roleRepo = AppDataSource.getRepository(Role);

    const predefinedRoles = [
      { name: "Admin", description: " Administrator with full access" },
      { name: "Hr", description: "Human Resources Role" },
      { name: "Interviewer", description: "Interviewer Role" },
      { name: "Candidate", description: "Candidate applying for jobs" },
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
  } catch (err) {
    console.error("Error seeding roles:", err);
  }
}

seedRoles();
