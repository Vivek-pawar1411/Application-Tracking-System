//database connection file
// This file establishes a connection to the MySQL database using TypeORM.
const { DataSource } = require('typeorm');
const { User } = require('../Entity/user.entity');
const { Role } = require('../Entity/roles.entity');
const { Permission } = require('../Entity/permission.entity');
require('dotenv').config();

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_port, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Role, Permission], // Register the user entity
    migrations: ["src/migrations/*.js"],
    synchronize: false, // Automatically synchronize the database schema

})

module.exports = { AppDataSource };