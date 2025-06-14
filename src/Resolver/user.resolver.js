const { checkAccessByRole, Roles } = require("../Middleware/auth.roles");
const { User } = require("../Entity/user.entity");
const { auth } = require("../Middleware/auth.middleware");
const { AppDataSource } = require("../database/db");
const bcrypt = require("bcrypt");

const userResolvers = {
  Query: {
    users: async (_, __, context) => {
      checkAccessByRole(context.user, [Roles.ADMIN, Roles.HR]);

      const userRepo = AppDataSource.getRepository(User);
      const users = await userRepo.find({ relations: ["roles"] });

      return users.map((user) => ({
        ...user,
        role_names: user.roles ? user.roles.map((role) => role.name) : [],
      }));
    },

    userbyid: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      if (String(context.user.id) !== String(id)) {
        throw new Error("Forbidden: You can only access your own data");
      }

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: { id: Number(id) },
        relations: ["roles"],
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        ...user,
        role_names: user.roles.map((role) => role.name),
      };
    },
  },

  Mutation: {
    addUser: async (_, { name, email, password, roleIds, contact }, context) => {
      checkAccessByRole(context.user, [Roles.ADMIN]);

      const userRepo = AppDataSource.getRepository(User);
      const roleRepo = AppDataSource.getRepository("Role");

      if (!name || name.trim().length < 3) {
        throw new Error("Name must be at least 3 characters long");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (!Array.isArray(roleIds) || roleIds.length === 0) {
        throw new Error("At least one role must be selected");
      }

      const contactRegex = /^[6-9]\d{9}$/;
      if (!contact || !contactRegex.test(contact)) {
        throw new Error("Invalid contact number");
      }

      const existingUser = await userRepo.findOneBy({ email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const roles = await roleRepo.findByIds(roleIds);
      if (roles.length !== roleIds.length) {
        throw new Error("One or more roles not found");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = userRepo.create({
        name,
        email,
        password: hashedPassword,
        roles,
        contact,
      });

      const savedUser = await userRepo.save(newUser);
      console.log("User created successfully:", savedUser);

      return { ...savedUser, role_names: roles.map((role) => role.name) };
    },

    login: async (_, { email, password }) => {
      const userRepo = AppDataSource.getRepository(User);

      if (!email || typeof email !== "string") {
        throw new Error("Email is required and must be a string");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const user = await userRepo.findOne({
        where: { email },
        relations: ["roles"],
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = auth({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles[0]?.name,
        contact: user.contact,
      });

      return {
        ...user,
        token,
        role_names: user.roles.map((role) => role.name),
      };
    },

    updateUser: async (_, { id, input }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      if (String(context.user.id) !== String(id)) {
        throw new Error("Forbidden: You can only access your own data");
      }

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id }, relations: ["roles"] });

      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }

      if (input.password) {
        input.password = await bcrypt.hash(input.password, 10);
      }

      Object.assign(user, input);
      const updatedUser = await userRepo.save(user);
      console.log("User updated successfully:", updatedUser);

      return {
        ...updatedUser,
        role_names: updatedUser.roles.map((role) => role.name),
      };
    },

    deleteUser: async (_, { id }, context) => {
      const { user } = context;

      if (!user) {
        throw new Error("Unauthorized");
      }

      const isSelf = String(user.id) === String(id);
      const isAdminOrHR = [Roles.ADMIN, Roles.HR].includes(user.role);

      if (!isSelf && !isAdminOrHR) {
        throw new Error("Forbidden: You can only delete your own account or must be Admin/HR");
      }

      const userRepo = AppDataSource.getRepository(User);
      const userToDelete = await userRepo.findOne({ where: { id } });

      if (!userToDelete) {
        throw new Error(`User with ID ${id} not found`);
      }

      console.log(
        `User Deleted: '${userToDelete.name}' (ID: ${userToDelete.id}) by '${user.name}' (Role: ${user.role}, ID: ${user.id})`
      );

      await userRepo.remove(userToDelete);
      return `User with ID ${id} has been deleted`;
    },
  },
};

module.exports = userResolvers;
