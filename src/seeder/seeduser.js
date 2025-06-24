const { AppDataSource } = require('../database/db');
const { User } = require('../Entity/user.entity');
const { Role } = require('../Entity/roles.entity');
const bcrypt = require('bcrypt');

async function seedUser() {
  const userRepository = AppDataSource.getRepository("User");
  const roleRepository = AppDataSource.getRepository("Role");

  const existingUser = await userRepository.findOneBy({ email: "nrt@gmail.com" });
  if (existingUser) {
    console.log("User already exists");
    return;
  }

  const adminRole = await roleRepository.findOneBy({ id: 1 });
  if (!adminRole) {
    console.error("Admin role (id: 1) not found");
    return;
  }

  const hashedPassword = await bcrypt.hash("newrise123", 10);

  const user = userRepository.create({
    firstName: "Master",                         
    lastName: "Admin",                           
    email: "nrt@gmail.com",
    password: hashedPassword,
    roles: [adminRole],
    mobileNo: 7415792359,                                             
    userType: "admin",                                                         
    is_blocked: false,                          
    isverified: true                            
  });

  await userRepository.save(user);

  console.log("✅ Admin user seeded successfully");
}

module.exports = seedUser;
