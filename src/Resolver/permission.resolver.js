const { AppDataSource } = require("../database/db");
const { Permission } = require("../Entity/permission.entity");

const permissionRepo = AppDataSource.getRepository("Permission");

const permissionResolvers = {
  Query: {
    permissions: async () => {
      return await permissionRepo.find({ relations: ["roles"] });
    },
    permission: async (_, { id }) => {
      return await permissionRepo.findOne({ where: { id }, relations: ["roles"] });
    },
  },
  Mutation: {
    createPermission: async (_, { input }) => {
      const newPermission = permissionRepo.create(input);
      return await permissionRepo.save(newPermission);
    },
    updatePermission: async (_, { id, input }) => {
      const permission = await permissionRepo.findOne({ where: { id } });
      if (!permission) {
        throw new Error(`Permission with ID ${id} not found`);
      }
      Object.assign(permission, input);
      return await permissionRepo.save(permission);
    },
    deletePermission: async (_, { id }) => {
      await permissionRepo.delete(id);
      return `Permission with ID ${id} deleted`;
    },
  },
};

module.exports = permissionResolvers;
