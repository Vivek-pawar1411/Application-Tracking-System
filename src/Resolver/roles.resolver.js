const { AppDataSource } = require("../database/db");
const { Role } = require("../Entity/roles.entity");
const { checkAccessByRole, Roles } = require("../Middleware/auth.roles");

const roleRepository = AppDataSource.getRepository("Role");

function generateSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
}

const roleResolvers = {
  Query: {
    rolesList: async (
      _,
      { page = 1, limit = 10, search, status, userType, sortBy = 'created_at', sortOrder = 'DESC' }
    ) => {
      try {
        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 10;

        const skip = (page - 1) * limit;

        // 👇 Includes permissions relation
        const queryBuilder = roleRepository
          .createQueryBuilder('role')
          .leftJoinAndSelect('role.permissions', 'permission');

        if (search && search.trim()) {
          queryBuilder.where(
            '(role.name LIKE :search OR role.description LIKE :search OR role.userType LIKE :search)',
            { search: `%${search.trim()}%` }
          );
        }

        if (status !== undefined && status !== null) {
          const condition = search ? 'andWhere' : 'where';
          queryBuilder[condition]('role.status = :status', { status: Boolean(status) });
        }

        if (userType && userType.trim()) {
          const condition = search || status !== undefined ? 'andWhere' : 'where';
          queryBuilder[condition]('role.userType = :userType', { userType: userType.trim() });
        }

        const validSortFields = ['id', 'name', 'userType', 'status', 'created_at', 'updated_at'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        queryBuilder.orderBy(`role.${sortField}`, order);

        const totalCount = await queryBuilder.getCount();
        const roles = await queryBuilder.skip(skip).take(limit).getMany();

        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
          data: roles,
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
            status: status !== undefined ? status : null,
            userType: userType || null,
            sortBy: sortField,
            sortOrder: order
          }
        };
      } catch (error) {
        throw new Error(`Error fetching roles list: ${error.message}`);
      }
    },

    roleById: async (_, { id }) => {
      return await roleRepository.findOne({ where: { id: parseInt(id) }, relations: ["permissions"] });
    },

    roleBySlug: async (_, { slug }) => {
      return await roleRepository.findOne({ where: { slug }, relations: ["permissions"] });
    },
  },

  Mutation: {
    createRole: async (_, { input }, context) => {
      checkAccessByRole(context.user, [Roles.Super_Admin, Roles.Master_Admin]);

      const { name, description, status, userType } = input;

      if (typeof status !== "boolean") throw new Error("Status must be a boolean");

      const slug = generateSlug(name);
      const existingSlug = await roleRepository.findOne({ where: { slug } });
      if (existingSlug) throw new Error("Role with this slug already exists");

      const newRole = roleRepository.create({ name, slug, description, status, userType });
      return await roleRepository.save(newRole);
    },

    updateRole: async (_, { id, input }, context) => {
      checkAccessByRole(context.user, [Roles.Super_Admin,Roles.Master_Admin]);

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

