// const { User } = require("./src/user/user.entity"); // Import the user entity
// const { Role } = require("./src/roles/roles.entity"); // Import the role entity
// const { Permission } = require("./src/permission/permission.entity"); // Import the permission entity

const path = require("path");
const { DataSource } = require("typeorm");
require("dotenv").config();

// Use absolute paths for entity imports
const User = require(path.join(__dirname, "src", "Entity", "user.entity")).User;
const Role = require(path.join(__dirname, "src", "Entity", "roles.entity")).Role;
const Permission = require(path.join(__dirname, "src", "Entity", "permission.entity")).Permission;

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Role, Permission], // Register the user entity
  migrations: ["src/migrations/*.js"], // ✅ FIXED path
  synchronize: false,
});

module.exports = AppDataSource;
