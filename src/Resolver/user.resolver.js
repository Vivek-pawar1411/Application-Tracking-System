const{checkAdminAccess}=require('../Middleware/auth.roles')
const {User}=require('../Entity/user.entity'); // Import user entity for TypeORM
const { auth } = require('../Middleware/auth.middleware'); // Authentication middleware
const {AppDataSource} = require('../database/db'); // Adjust path as needed
const bcrypt = require('bcrypt');

const userResolvers = {
  Query: {
  users: async (_, __, context) => {
  checkAdminAccess(context.user);
  const userRepo = AppDataSource.getRepository(User);
  return await userRepo.find({relations: ['roles'],});
   return {
    ...user,
    role_names: user.roles.map(role => role.name),
  };
},

    userbyid: async (_, { id }, context) => {
  if (!context.user) {
    throw new Error('Unauthorized');
  }

  if (String(context.user.id) !== String(id)) {
    throw new Error('Forbidden: You can only access your own data');
  }

  const userRepo = AppDataSource.getRepository(User);

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
  };
},
  },

  Mutation: {
 addUser: async (_, { name, email, password, roleIds }) => {
  const userRepo = AppDataSource.getRepository(User);
  const roleRepo = AppDataSource.getRepository('Role');

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
  });

  const savedUser = await userRepo.save(newUser);

  return {...savedUser,role_names: roles.map(role => role.name),}; // 👈 map roles to role_ids

},



    login: async (_, { email, password }) => {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({where: {email}, relation:['roles'], }); // For production, hash password and use bcrypt.compare()

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isMatch=await bcrypt.compare(password,user.password);

      const token = auth(user);
      return { ...user, token,role_names: user.roles.map(role => role.name) }; // 👈 map roles to role_names
    },
  },
};


module.exports =  userResolvers ;