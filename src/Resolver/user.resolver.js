const { checkAccessByRole, Roles } = require("../Middleware/auth.roles");
const { validateEmail, validateContact, validatePassword, validateName, } = require("../utils/validation");
const { getRepo, checkAuth, checkOwnership, hashPassword,
  comparePassword, generateToken, formatUserWithRoles, } = require("../utils/helper");
const { sendOTP } = require("../verifyotp/send_otp");
const { AppDataSource } = require("../database/db"); // assuming this is needed for OTP operations

const userResolvers = {
  Query: {
    users: async (_, __, context) => {
      checkAccessByRole(context.user, [Roles.ADMIN, Roles.HR]);
      const userRepo = getRepo("User");
      const users = await userRepo.find({ relations: ["roles"] });
      return users.map(formatUserWithRoles);
    },

    userbyid: async (_, { id }, context) => {
      checkAuth(context);
      checkOwnership(context.user, id);
      const userRepo = getRepo("User");
      const user = await userRepo.findOne({
        where: { id: Number(id) },
        relations: ["roles"],
      });
      if (!user) throw new Error("User not found");
  // checkVerified(user); // 🔐 Optional, based on your access policy

      return formatUserWithRoles(user);
    },
  },

  Mutation: {
    addUser: async (_, { name, email, password, roleIds, contact }, context) => {
      checkAccessByRole(context.user, [Roles.ADMIN]);

      const userRepo = getRepo("User");
      const roleRepo = getRepo("Role");

      validateName(name);
      validateEmail(email);
      validatePassword(password);
      validateContact(contact);

      if (!Array.isArray(roleIds) || roleIds.length === 0) {
        throw new Error("At least one role must be selected");
      }

      const existingUser = await userRepo.findOneBy({ email });
      if (existingUser) throw new Error("User with this email already exists");

      const roles = await roleRepo.findByIds(roleIds);
      if (roles.length !== roleIds.length) {
        throw new Error("One or more roles not found");
      }

      const hashedPassword = await hashPassword(password);
      const newUser = userRepo.create({ name, email, password: hashedPassword, roles, contact });
      const savedUser = await userRepo.save(newUser);

      return { ...savedUser, role_names: roles.map((r) => r.name) };
    },

    sendotp: async (_, { email }) => {
      const repo = AppDataSource.getRepository('User');
      const user = await repo.findOne({ where: { email } });
      if (!user) throw new Error('User not found');

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await repo.save(user);

      await sendOTP(email, otp);
      return { message: 'OTP sent successfully', status: true };
    },

    verifyotp: async (_, { email, otp }) => {
      const repo = AppDataSource.getRepository('User');
      const user = await repo.findOne({ where: { email } });
      if (!user) throw new Error('User not found');

      const now = new Date();
      if (user.otp !== otp || !user.otpExpiry || now > user.otpExpiry) {
        throw new Error('Invalid or expired OTP');
      }

      user.otp = null;
      user.otpExpiry = null;
      user.isverified = true;
      await repo.save(user);

      return { message: 'OTP verified successfully', user, verified: true };
    },

    login: async (_, { email, password }) => {
      const userRepo = getRepo("User");
      validateEmail(email);
      validatePassword(password);

      const user = await userRepo.findOne({ where: { email }, relations: ["roles"] });
      if (!user || !(await comparePassword(password, user.password))) {
        throw new Error("Invalid credentials");
      }
        checkVerified(user); // ✅ Only verified users can log in

      const token = generateToken(user);
      return { ...user, token, role_names: user.roles.map((r) => r.name) };
    },

    updateUser: async (_, { id, input }, context) => {
      checkAuth(context);
      checkOwnership(context.user, id);

      const userRepo = getRepo("User");
      const user = await userRepo.findOne({ where: { id }, relations: ["roles"] });

      if (!user) throw new Error(`User with ID ${id} not found`);
        checkVerified(user); // ✅ Enforce verification before allowing update

      if (input.password) {
        input.password = await hashPassword(input.password);
      }

      Object.assign(user, input);
      const updatedUser = await userRepo.save(user);

      return formatUserWithRoles(updatedUser);
    },

    deleteUser: async (_, { id }, context) => {
      checkAuth(context);
      const { user } = context;
      const isSelf = String(user.id) === String(id);
      const isAdminOrHR = [Roles.ADMIN, Roles.HR].includes(user.role);

      if (!isSelf && !isAdminOrHR) {
        throw new Error("Forbidden: You can only delete your own account or must be Admin/HR");
      }

      const userRepo = getRepo("User");
      const userToDelete = await userRepo.findOne({ where: { id } });
      if (!userToDelete) throw new Error(`User with ID ${id} not found`);

      await userRepo.remove(userToDelete);
      return `User with ID ${id} has been deleted`;
    },
  },
};

module.exports = userResolvers;
