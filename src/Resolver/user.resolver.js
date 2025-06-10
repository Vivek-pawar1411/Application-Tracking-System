// This file contains the user-related GraphQL resolvers
const { checkAdminAccess } = require('../Middleware/auth.roles')
const { User } = require('../Entity/user.entity'); // Import user entity for TypeORM
const { auth } = require('../Middleware/auth.middleware'); // Authentication middleware
const { AppDataSource } = require('../database/db'); // Adjust path as needed
const bcrypt = require('bcrypt');

const userResolvers = {
  Query: {
    // Fetch all users with their roles
    users: async (_, __, context) => {
      checkAdminAccess(context.user); // Ensure the user has admin access

      const userRepo = AppDataSource.getRepository(User);
      const users = await userRepo.find({ relations: ['roles'] });

      return users.map(user => ({
        ...user,
        role_names: user.roles ? user.roles.map(role => role.name) : [],
      }));
    },

    // Fetch a user by ID with their roles
    userbyid: async (_, { id }, context) => {
      // Ensure the user is authenticated and authorized to access this data
      if (!context.user) {
        throw new Error('Unauthorized');
      }
      // Check if the authenticated user is trying to access their own data
      if (String(context.user.id) !== String(id)) {
        throw new Error('Forbidden: You can only access your own data');
      }

      const userRepo = AppDataSource.getRepository(User);
      // Fetch the user by ID and include their roles
      const user = await userRepo.findOne({
        where: { id: Number(id) },
        relations: ['roles'],
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        ...user,
        role_names: user.roles.map(role => role.name),
      }; // 👈 map roles to role_names
    },
  },

  Mutation: {
    // Add a new user with roles
    addUser: async (_, { name, email, password, roleIds,contact }) => {
      const userRepo = AppDataSource.getRepository(User);
      const roleRepo = AppDataSource.getRepository('Role');
      // Check if the user already exists
      const existingUser = await userRepo.findOneBy({ email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const roles = await roleRepo.findByIds(roleIds);

      if (roles.length !== roleIds.length) {
        throw new Error("One or more roles not found");
      }
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = userRepo.create({
        name,
        email,
        password: hashedPassword,
        roles,
        contact
      });
      // Save the new user to the database
      const savedUser = await userRepo.save(newUser);
      console.log("User created successfully:", savedUser);

      return { ...savedUser, role_names: roles.map(role => role.name), }; // 👈 map roles to role_ids

    },

    //login mutation for user authentication
    login: async (_, { email, password }) => {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { email }, relations: ['roles'], }); // For production, hash password and use bcrypt.compare()

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      const token = auth({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles[0]?.name, // ✅ embed role
        contact: user.contact,
      });
      return { ...user, token, role_names: user.roles.map(role => role.name) }; // 👈 map roles to role_names
    },
  },
};


module.exports = userResolvers;