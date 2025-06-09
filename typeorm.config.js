const { User } = require('./src/user/user.entity'); // Import the user entity
const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User], // Register the user entity
  migrations: ["src/migrations/*.js"], // ✅ FIXED path
  synchronize: false,
});

module.exports = AppDataSource;
