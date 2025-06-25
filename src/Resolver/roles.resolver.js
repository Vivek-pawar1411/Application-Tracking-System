const { AppDataSource } = require("../database/db");
const { Role } = require("../Entity/roles.entity");
const { checkAccessByRole, Roles } = require("../Middleware/auth.roles");

const roleRepository = AppDataSource.getRepository("Role");

function generateSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
}

const roleResolvers = {
  Query: {
    roles: async () => {
      return await roleRepository.find();
    },

    roleById: async (_, { id }) => {
      return await roleRepository.findOne({ where: { id: parseInt(id) } });
    },

    roleBySlug: async (_, { slug }) => {
      return await roleRepository.findOne({ where: { slug } });
    },
  },

  Mutation: {
    createRole: async (_, { input }, context) => {
checkAccessByRole(context.user, [Roles.Super_Admin, Roles.Master_Admin]);

      const { name, description, status, userType } = input;

      // if (!name || name.trim().length < 3) throw new Error("Role name must be at least 3 characters long");
      // if (!userType || userType.trim().length < 3) throw new Error("userType must be at least 3 characters long");
      if (typeof status !== "boolean") throw new Error("Status must be a boolean");

      const slug = generateSlug(name);
      const existingSlug = await roleRepository.findOne({ where: { slug } });
      if (existingSlug) throw new Error("Role with this slug already exists");

      const newRole = roleRepository.create({ name, slug, description, status, userType });
      return await roleRepository.save(newRole);
    },

    updateRole: async (_, { id, input }, context) => {
      checkAccessByRole(context.user, [Roles.ADMIN]);

      const role = await roleRepository.findOne({ where: { id: parseInt(id) } });
      if (!role) throw new Error(`Role with ID ${id} not found`);

      const { name, description, status, userType } = input;

      if (name) {
        if (name.trim().length < 3) throw new Error("Role name must be at least 3 characters long");
        role.name = name;
        role.slug = generateSlug(name);
      }

      if (description !== undefined) role.description = description;
      if (status !== undefined) role.status = status;
      if (userType) {
        if (userType.trim().length < 3) throw new Error("userType must be at least 3 characters long");
        role.userType = userType;
      }

      return await roleRepository.save(role);
    },

    deleteRole: async (_, { id }, context) => {
      checkAccessByRole(context.user, [Roles.ADMIN]);

      const role = await roleRepository.findOne({ where: { id: parseInt(id) } });
      if (!role) throw new Error(`Role with ID ${id} not found`);

      await roleRepository.remove(role);
      return `Role with ID ${id} has been deleted`;
    },
  },
};

module.exports = roleResolvers;

