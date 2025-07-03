const { checkAccessByRole, Roles } = require("../Middleware/auth.roles");
const {validateEmail,validateContact,validatePassword,validateName,} = require("../utils/validation");
const {getRepo,checkAuth,checkOwnership,hashPassword,checkVerified,
            comparePassword,generateToken,formatUserWithRoles,} = require("../utils/helper");
const { sendOTP } = require("../verifyotp/send_otp");
const { AppDataSource } = require("../database/db");

// const userResolvers = {
//   Query: {
//     users: async (_, __, context) => {
//       checkAccessByRole(context.user, [Roles. Master_Admin]);
//       const userRepo = getRepo("User");
//       const users = await userRepo.find({ relations: ["roles"] });
//       return users.map(formatUserWithRoles);
//     },

//     userbyid: async (_, { id }, context) => {
//       checkAuth(context);
//       checkOwnership(context.user, id);
//       const userRepo = getRepo("User");
//       const user = await userRepo.findOne({
//         where: { id: Number(id) },
//         relations: ["roles"],
//       });
//       if (!user) throw new Error("User not found");
//       // checkVerified(user); // 🔐 Optional, based on your access policy

//       return formatUserWithRoles(user);
//     },
//   },

//   Mutation: {
//     addUser: async (_, { firstName, lastName, email, password, roleIds,
//       countryCode, mobileNo, userType, }, context) => {
//       checkAccessByRole(context.user, [Roles.Master_Admin]);

//       const userRepo = getRepo("User");
//       const roleRepo = getRepo("Role");

//       validateName(firstName); // using first name for validation
//       validateEmail(email);
//       validatePassword(password);
//       validateContact(mobileNo);

//       if (!Array.isArray(roleIds) || roleIds.length === 0) {
//         throw new Error("At least one role must be selected");
//       }

//       const existingUser = await userRepo.findOne({
//         where: [{ email }, { mobileNo }],
//       });
//       if (existingUser)
//         throw new Error("User with this email, mobileNo already exists");

//       const roles = await roleRepo.findByIds(roleIds);
//       if (roles.length !== roleIds.length) {
//         throw new Error("One or more roles not found");
//       }

//       const hashedPassword = await hashPassword(password);
//       const newUser = userRepo.create({
//         firstName, lastName, email,
//         password: hashedPassword, countryCode, mobileNo, userType: userType || "user", roles,
//       });

//       const savedUser = await userRepo.save(newUser);
//       console.log("New User added", savedUser);
//       return { ...savedUser, role_names: roles.map((r) => r.name) };
//     },

//     sendotp: async (_, { email }) => {
//       const repo = AppDataSource.getRepository('User');
//       const user = await repo.findOne({ where: { email } });
//       if (!user) throw new Error('User not found');

//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//       user.otp = otp;
//       user.otpExpiry = otpExpiry;
//       await repo.save(user);

//       await sendOTP(email, otp);
//       return { message: 'OTP sent successfully', status: true };
//     },

//     verifyotp: async (_, { email, otp }) => {
//       const repo = AppDataSource.getRepository('User');
//       const user = await repo.findOne({ where: { email } });
//       if (!user) throw new Error('User not found');

//       const now = new Date();
//       if (user.otp !== otp || !user.otpExpiry || now > user.otpExpiry) {
//         throw new Error('Invalid or expired OTP');
//       }

//       user.otp = null;
//       user.otpExpiry = null;
//       user.isverified = true;
//       await repo.save(user);

//       return { message: 'OTP verified successfully', user, verified: true };
//     },

//     login: async (_, { email, password }) => {
//       const userRepo = getRepo("User");
//       const tokenRepo = getRepo("Token"); // 💡 Get Token repository

//       validateEmail(email);
//       validatePassword(password);

//       const user = await userRepo.findOne({ where: { email }, relations: ["roles"] });
//       if (!user || !(await comparePassword(password, user.password))) {
//         throw new Error("Invalid credentials");
//       }

//       // checkVerified(user); // ✅ Optional: uncomment to enforce verified users only

//   // 🧹 Clean expired tokens before issuing new one
//   await tokenRepo
//     .createQueryBuilder()
//     .delete()
//     .from("Token")
//     .where("userId = :userId AND expiresAt < :now", {
//       userId: user.id,
//       now: new Date(),}).execute();

//       const token = generateToken(user); // 🔐 Issue token
//       const expiresAt = new Date(Date.now()+ 24*  60 * 60 * 1000); // 24 hour expiry

//       // ✅ Store token in Token table
//       await tokenRepo.save({ token, userId: user.id, expiresAt,});

//       // 🔐 Optional: Cleanup old tokens (max 5 tokens per user)
//       const userTokens = await tokenRepo.find({
//         where: { userId: user.id, isBlacklisted: false },
//         order: { createdAt: "ASC" }, });

//       if (userTokens.length > 5) {
//         const tokensToDelete = userTokens.slice(0, userTokens.length - 5);
//         for (const t of tokensToDelete) {
//           await tokenRepo.update(t.id, { isBlacklisted: true });
//         }
//       }

//       return { ...user,token,role_names: user.roles.map((r) => r.name), };
//     },

//     updateUser: async (_, { id, input }, context) => {
//       checkAccessByRole(context.user, [Roles.Master_Admin]);

//       checkAuth(context);
//       checkOwnership(context.user, id);

//       const userRepo = getRepo("User");
//       const user = await userRepo.findOne({ where: { id }, relations: ["roles"] });

//       if (!user) throw new Error(`User with ID ${id} not found`);
//       checkVerified(user); // ✅ Enforce verification before allowing update

//       if (input.password) {
//         input.password = await hashPassword(input.password);
//       }

//       Object.assign(user, input);
//       const updatedUser = await userRepo.save(user);

//       return formatUserWithRoles(updatedUser);
//     },

//     deleteUser: async (_, { id }, context) => {
//       checkAccessByRole(context.user, [Roles.Master_Admin]);

//       checkAuth(context);
//       const { user } = context;
//       const isSelf = String(user.id) === String(id);
//       const isAdminOrHR = [Roles.Master_Admin, Roles.Super_Admin].includes(user.role);

//       if (!isSelf && !isAdminOrHR) {
//         throw new Error("Forbidden: You can only delete your own account or must be Admin/HR");
//       }

//       const userRepo = getRepo("User");
//       const userToDelete = await userRepo.findOne({ where: { id } });
//       if (!userToDelete) throw new Error(`User with ID ${id} not found`);

//       await userRepo.remove(userToDelete);
//       return `User with ID ${id} has been deleted`;
//     },
//   },

//     blockUser: async (_, { userId, block }, context) => {
//   // ✅ Authorization Check
//   checkAccessByRole(context.user, [Roles.Admin]);

//   const userRepo = getRepo("User");
//   const userToBlock = await userRepo.findOne({ where: { id: userId } });

//   if (!userToBlock) throw new Error(`User with ID ${userId} not found`);

//   // Don't allow blocking self
//   if (context.user.id === userToBlock.id) {
//     throw new Error("You cannot block/unblock yourself");
//   }

//   userToBlock.is_blocked = block;
//   await userRepo.save(userToBlock);

//   return {
//     message: `User ${block ? "blocked" : "unblocked"} successfully.`,
//     user: formatUserWithRoles(userToBlock),
//   };
// }

// };

const userResolvers = {
  Query: {
    // 🚀 Paginated Users Query
    usersList: async (
      _,
      {
        page = 1,
        limit = 10,
        search,
        isverified,
        userType,
        roleId,
        sortBy = "created_at",
        sortOrder = "DESC",
      },
      context
    ) => {
      try {
        checkAccessByRole(context.user, [Roles.Master_Admin]);

        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 10;

        const skip = (page - 1) * limit;
        const userRepo = getRepo("User");

        const queryBuilder = userRepo
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.roles", "role");

        if (search && search.trim()) {
          queryBuilder.where(
            "(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search OR user.mobileNo LIKE :search)",
            { search: `%${search.trim()}%` }
          );
        }

        if (isverified !== undefined && isverified !== null) {
          if (search && search.trim()) {
            queryBuilder.andWhere("user.isverified = :isverified", {
              isverified: Boolean(isverified),
            });
          } else {
            queryBuilder.where("user.isverified = :isverified", {
              isverified: Boolean(isverified),
            });
          }
        }

        if (userType && userType.trim()) {
          const condition =
            search || isverified !== undefined ? "andWhere" : "where";
          queryBuilder[condition]("user.userType = :userType", {
            userType: userType.trim(),
          });
        }

        if (roleId) {
          const condition =
            search || isverified !== undefined || userType
              ? "andWhere"
              : "where";
          queryBuilder[condition]("role.id = :roleId", {
            roleId: parseInt(roleId),
          });
        }

        const validSortFields = [
          "id",
          "firstName",
          "lastName",
          "email",
          "userType",
          "isverified",
          "created_at",
          "updated_at",
        ];
        const sortField = validSortFields.includes(sortBy)
          ? sortBy
          : "created_at";
        const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

        queryBuilder.orderBy(`user.${sortField}`, order);

        const totalCount = await queryBuilder.getCount();

        const users = await queryBuilder.skip(skip).take(limit).getMany();

        const formattedUsers = users.map(formatUserWithRoles);

        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
          data: formattedUsers,
          pagination: {
            currentPage: page,
            limit,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            nextPage: hasNextPage ? page + 1 : null,
            previousPage: hasPreviousPage ? page - 1 : null,
          },
          filters: {
            search: search || null,
            isverified: isverified !== undefined ? isverified : null,
            userType: userType || null,
            roleId: roleId || null,
            sortBy: sortField,
            sortOrder: order,
          },
        };
      } catch (error) {
        throw new Error(`Error fetching users list: ${error.message}`);
      }
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
      return formatUserWithRoles(user);
    },
  },

  Mutation: {
    addUser: async (
      _,
      { firstName, lastName, email, password, roleIds, mobileNo, userType },
      context
    ) => {
      checkAccessByRole(context.user, [Roles.Master_Admin]);

      const userRepo = getRepo("User");
      const roleRepo = getRepo("Role");

      validateName(firstName);
      validateEmail(email);
      validatePassword(password);
      validateContact(mobileNo);

      if (!Array.isArray(roleIds) || roleIds.length === 0) {
        throw new Error("At least one role must be selected");
      }

      const existingUser = await userRepo.findOne({
        where: [{ email }, { mobileNo }],
      });
      if (existingUser)
        throw new Error("User with this email, mobileNo already exists");

      const roles = await roleRepo.findByIds(roleIds);
      if (roles.length !== roleIds.length) {
        throw new Error("One or more roles not found");
      }

      const hashedPassword = await hashPassword(password);
      const newUser = userRepo.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mobileNo,
        userType: userType || "user",
        roles,
      });

      const savedUser = await userRepo.save(newUser);
      return { ...savedUser, role_names: roles.map((r) => r.name) };
    },

    sendotp: async (_, { email }) => {
      const repo = AppDataSource.getRepository("User");
      const user = await repo.findOne({ where: { email } });
      if (!user) throw new Error("User not found");

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await repo.save(user);

      await sendOTP(email, otp);
      return { message: "OTP sent successfully", status: true };
    },

    verifyotp: async (_, { email, otp }) => {
      const repo = AppDataSource.getRepository("User");
      const user = await repo.findOne({ where: { email } });
      if (!user) throw new Error("User not found");

      const now = new Date();
      if (user.otp !== otp || !user.otpExpiry || now > user.otpExpiry) {
        throw new Error("Invalid or expired OTP");
      }

      user.otp = null;
      user.otpExpiry = null;
      user.isverified = true;
      await repo.save(user);

      return { message: "OTP verified successfully", user, verified: true };
    },

    login: async (_, { email, password }) => {
      const userRepo = getRepo("User");
      const tokenRepo = getRepo("Token");

      validateEmail(email);
      validatePassword(password);

      const user = await userRepo.findOne({
        where: { email },
        relations: ["roles"],
      });
      if (!user || !(await comparePassword(password, user.password))) {
        throw new Error("Invalid credentials");
      }

      await tokenRepo
        .createQueryBuilder()
        .delete()
        .from("Token")
        .where("userId = :userId AND expiresAt < :now", {
          userId: user.id,
          now: new Date(),
        })
        .execute();

      const token = generateToken(user);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await tokenRepo.save({ token, userId: user.id, expiresAt });

      const userTokens = await tokenRepo.find({
        where: { userId: user.id, isBlacklisted: false },
        order: { createdAt: "ASC" },
      });

      if (userTokens.length > 5) {
        const tokensToDelete = userTokens.slice(0, userTokens.length - 5);
        for (const t of tokensToDelete) {
          await tokenRepo.update(t.id, { isBlacklisted: true });
        }
      }

      return {
        ...user,
        token,
        role_names: user.roles.map((r) => r.name),
      };
    },

    updateUser: async (_, { id, input }, context) => {
       checkAccessByRole(context.user, [Roles.Master_Admin, Roles.Super_Admin, Roles.HR,  Roles.INTERVIEWER, Roles.CANDIDATE]);
      checkAuth(context);
      checkOwnership(context.user, id);

      const userRepo = getRepo("User");
      const user = await userRepo.findOne({
        where: { id },
        relations: ["roles"],
      });
      if (!user) throw new Error(`User with ID ${id} not found`);
      checkVerified(user);

      if (input.password) {
        input.password = await hashPassword(input.password);
      }

      Object.assign(user, input);
      const updatedUser = await userRepo.save(user);
      return formatUserWithRoles(updatedUser);
    },

    deleteUser: async (_, { id }, context) => {
      checkAccessByRole(context.user, [Roles.Master_Admin]);
      checkAuth(context);

      const { user } = context;

      const isSelf = String(user.id) === String(id);
      const isAdminOrHR = [Roles.Master_Admin, Roles.Super_Admin].includes(
        user.role
      );

      if (!isSelf && !isAdminOrHR) {
        throw new Error(
          "Forbidden: You can only delete your own account or must be Admin/HR"
        );
      }

      const userRepo = getRepo("User");
      const userToDelete = await userRepo.findOne({ where: { id } });
      if (!userToDelete) throw new Error(`User with ID ${id} not found`);

      await userRepo.remove(userToDelete);
      return `User with ID ${id} has been deleted`;
    },
    // ✅ ✅ ✅ Correctly placed blockUser mutation
    blockUser: async (_, { userId, block }, context) => {
      checkAccessByRole(context.user, [Roles.Master_Admin, Roles.Super_Admin]);

      const userRepo = getRepo("User");
      const userToBlock = await userRepo.findOne({ where: { id: userId } });

      if (!userToBlock) throw new Error(`User with ID ${userId} not found`);
      if (context.user.id === userToBlock.id) {
        throw new Error("You cannot block/unblock yourself");
      }

      userToBlock.is_blocked = block;
      await userRepo.save(userToBlock);

      return {
        message: `User ${block ? "blocked" : "unblocked"} successfully.`,
        user: formatUserWithRoles(userToBlock),
      };
    },
  },
};

module.exports = userResolvers;
