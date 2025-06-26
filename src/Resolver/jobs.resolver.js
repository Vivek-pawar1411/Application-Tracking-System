const { AppDataSource } = require("../database/db");
const { checkAccessByRole, Roles } = require("../Middleware/auth.roles");
const { Jobs } = require("../Entity/jobs.entity");
const { User } = require("../Entity/user.entity");

const jobResolvers = {
  Query: {
    allJobs: async (_, __, context) => {
      //await checkAccessByRole(context, [Roles.HR]); // ✅ Only HR can access
      const repo = AppDataSource.getRepository(Jobs);
      return await repo.find();
    },

    jobById: async (_, { id }, context) => {
      //await checkAccessByRole(context, [Roles.HR]); // ✅ Only HR can access
      const repo = AppDataSource.getRepository(Jobs);
      return await repo.findOne({ where: { id: parseInt(id) } });
    },
  },

  Mutation: {
    createJob: async (_, { data }, context) => {
      await checkAccessByRole(context.user, [Roles.HR]); // ✅ Only HR can create

      const userRepo = AppDataSource.getRepository(User);
      const creator = await userRepo.findOneBy({ id: data.created_by });
      if (!creator) throw new Error("User not found");

      const repo = AppDataSource.getRepository(Jobs);
      const job = repo.create({
        ...data,
        created_by: creator,
      });

      return await repo.save(job);
    },

    updateJob: async (_, { id, data }, context) => {
      await checkAccessByRole(context, [Roles.HR]); // ✅ Only HR can update

      const repo = AppDataSource.getRepository(Jobs);
      const job = await repo.findOne({ where: { id: parseInt(id) } });
      if (!job) throw new Error("Job not found");

      Object.assign(job, data);
      return await repo.save(job);
    },

    deleteJob: async (_, { id }, context) => {
      await checkAccessByRole(context, [Roles.HR]); // ✅ Only HR can delete

      const repo = AppDataSource.getRepository(Jobs);
      const job = await repo.findOne({ where: { id: parseInt(id) } });
      if (!job) return false;

      await repo.remove(job);
      return true;
    },
  },
};

module.exports = jobResolvers;
