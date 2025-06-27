// 
const { AppDataSource } = require("../database/db");
const { Permission } = require("../Entity/permission.entity");
const { Role } = require("../Entity/roles.entity");
const { In } = require("typeorm");

const permissionRepo = AppDataSource.getRepository("Permission");
const roleRepo = AppDataSource.getRepository("Role");

const permissionResolvers = {
  Query: {
    permissionList: async (
      _,
      {
        page = 1,
        limit = 10,
        search,
        permission_group,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      }
    ) => {
      try {
        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 10;

        const skip = (page - 1) * limit;
        const queryBuilder = permissionRepo.createQueryBuilder('permission').leftJoinAndSelect('permission.roles', 'role');

        if (search && search.trim()) {
          queryBuilder.where(
            '(permission.name LIKE :search OR permission.slug LIKE :search OR permission.permission_group LIKE :search)',
            { search: `%${search.trim()}%` }
          );
        }

        if (permission_group && permission_group.trim()) {
          const condition = search ? 'andWhere' : 'where';
          queryBuilder[condition](
            'permission.permission_group = :permission_group',
            { permission_group: permission_group.trim() }
          );
        }

        const validSortFields = ['id', 'name', 'slug', 'permission_group', 'created_at', 'updated_at'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        queryBuilder.orderBy(`permission.${sortField}`, order);

        const totalCount = await queryBuilder.getCount();
        const permissions = await queryBuilder.skip(skip).take(limit).getMany();

        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
          data: permissions,
          pagination: {
            currentPage: page,
            limit,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            nextPage: hasNextPage ? page + 1 : null,
            previousPage: hasPreviousPage ? page - 1 : null
          },
          filters: {
            search: search || null,
            permission_group: permission_group || null,
            sortBy: sortField,
            sortOrder: order
          }
        };
      } catch (err) {
        throw new Error(`Error fetching permission list: ${err.message}`);
      }
    },

    permission: async (_, { id }) => {
      return await permissionRepo.findOne({ where: { id }, relations: ["roles"] });
    },

    roleswithPermissions: async (_, { id }) => {
      const role = await roleRepo.findOne({ where: { id }, relations: ["permissions"] });
      if (!role) {
        throw new Error(`Role with ID ${id} not found`);
      }
      return role;
    },
  },

  Mutation: {
    assignPermissionToRole: async (_, { roleId, permissionIds }) => {
      const role = await roleRepo.findOne({ where: { id: roleId }, relations: ["permissions"] });
      if (!role) throw new Error(`Role with ID ${roleId} not found`);

      const permissions = await permissionRepo.find({ where: { id: In(permissionIds) } });
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
