const { AppDataSource } = require("../database/db");
const { Permission } = require("../Entity/permission.entity");
const { Role } = require("../Entity/roles.entity");
const permissionRepo = AppDataSource.getRepository("Permission");
const roleRepo  = AppDataSource.getRepository("Role");
const { In } = require("typeorm");

const permissionResolvers = {
  Query: {
    permissions: async () => {
      return await permissionRepo.find({ relations: ["roles"] });
    },
    permission: async (_, { id }) => {
      return await permissionRepo.findOne({ where: { id }, relations: ["roles"] });
    },
    roleswithPermissions: async (_, { id }) => {
      const roleRepo = AppDataSource.getRepository("Role");
      const role = await roleRepo.findOne({ where: { id }, relations: ["permissions"] });
      if (!role) {
        throw new Error(`Role with ID ${id} not found`);
      }
      return role;
    },
  },
  Mutation: {

      assignPermissionToRole: async (_, { roleId, permissionIds }) => {
      const role = await roleRepo.findOne({where: { id: roleId },relations: ["permissions"],});

      if (!role) throw new Error(`Role with ID ${roleId} not found`);

      const permissions = await permissionRepo.find({ where: { id: In(permissionIds) },});

      if (!permissions.length) throw new Error(`No permissions found for the given IDs`);

      const existing = role.permissions || [];

      const merged = [
        ...existing,
        ...permissions.filter(p => !existing.find(e => e.id === p.id)),
      ];

      role.permissions = merged;

      return await roleRepo.save(role);
    },



    createPermission: async (_, { input }) => {
      const newPermission = permissionRepo.create(input);
      return await permissionRepo.save(newPermission);
    },
    // updatePermission: async (_, { id, input }) => {
    //   const permission = await permissionRepo.findOne({ where: { id } });
    //   if (!permission) {
    //     throw new Error(`Permission with ID ${id} not found`);
    //   }
    //   Object.assign(permission, input);
    //   return await permissionRepo.save(permission);
    // },
    deletePermission: async (_, { id }) => {
      await permissionRepo.delete(id);
      return `Permission with ID ${id} deleted`;
    },
  },
};

module.exports = permissionResolvers;
