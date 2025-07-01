const { AppDataSource } = require("../database/db");
const { checkAccessByRole, Roles } = require("../Middleware/auth.roles");
const { Jobs } = require("../Entity/jobs.entity");
const { User } = require("../Entity/user.entity");

const jobResolvers = {
  Query: {
    jobList: async (
      _,
      { page = 1, limit = 10, search, department, location, status, sortBy = 'created_at', sortOrder = 'DESC' },
      context
    ) => {
      try {
        const repo = AppDataSource.getRepository(Jobs);

        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 10;

        const skip = (page - 1) * limit;
        const queryBuilder = repo.createQueryBuilder("job").leftJoinAndSelect("job.created_by", "user");

        if (search && search.trim()) {
          queryBuilder.where(
            "(job.title LIKE :search OR job.description LIKE :search OR job.department LIKE :search)",
            { search: `%${search.trim()}%` }
          );
        }

        if (department) {
          const condition = search ? "andWhere" : "where";
          queryBuilder[condition]("job.department = :department", { department });
        }

        if (location) {
          const condition = search || department ? "andWhere" : "where";
          queryBuilder[condition]("job.location = :location", { location });
        }

        if (status !== undefined && status !== null) {
          const condition = search || department || location ? "andWhere" : "where";
          queryBuilder[condition]("job.status = :status", { status });
        }

        const validSortFields = ["id", "title", "department", "location", "created_at", "posted_date"];
        const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at";
        const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

        queryBuilder.orderBy(`job.${sortField}`, order);

        const totalCount = await queryBuilder.getCount();
        const jobs = await queryBuilder.skip(skip).take(limit).getMany();

        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
          data: jobs,
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
            department: department || null,
            location: location || null,
            status: status !== undefined ? status : null,
            sortBy: sortField,
           
          }
        };
      } catch (err) {
        throw new Error("Failed to fetch job list: " + err.message);
      }
    },

    jobById: async (_, { id }, context) => {
      const repo = AppDataSource.getRepository(Jobs);
      return await repo.findOne({ where: { id: parseInt(id) }, relations: ["created_by"] });
    },
  },

  Mutation: {
    createJob: async (_, { data }, context) => {
      await checkAccessByRole(context.user, [Roles.Master_Admin, Roles.HR]);

      const userRepo = AppDataSource.getRepository(User);
      const creator = await userRepo.findOneBy({ id: data.created_by });
      if (!creator) throw new Error("User not found");

      const repo = AppDataSource.getRepository(Jobs);
      const job = repo.create({ ...data, created_by: creator });

      return await repo.save(job);
    },

    updateJob: async (_, { id, data }, context) => {
      await checkAccessByRole(context, [Roles.HR]);

      const repo = AppDataSource.getRepository(Jobs);
      const job = await repo.findOne({ where: { id: parseInt(id) } });
      if (!job) throw new Error("Job not found");

      Object.assign(job, data);
      return await repo.save(job);
    },

    deleteJob: async (_, { id }, context) => {
      await checkAccessByRole(context, [Roles.HR]);

      const repo = AppDataSource.getRepository(Jobs);
      const job = await repo.findOne({ where: { id: parseInt(id) } });
      if (!job) return false;

      await repo.remove(job);
      return true;
    },
  },
};

module.exports = jobResolvers;
