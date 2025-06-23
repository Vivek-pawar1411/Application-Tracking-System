// src/database/db.js
const { DataSource } = require('typeorm');
const { User } = require('../Entity/user.entity');
const { Role } = require('../Entity/roles.entity');
const { Token } = require('../Entity/token.entity');
const { Permission } = require('../Entity/permission.entity');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Role, Permission, Token],
  migrations: ['src/migrations/*.js'],
  synchronize: false,
});

module.exports = { AppDataSource }; // ✅ MUST be exported this way
