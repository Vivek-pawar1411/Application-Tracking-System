const {AppDataSource} = require('../database/db'); // Adjust path as needed
const { Role } = require('../Entity/roles.entity'); // Adjust path as needed

const roleRepository = AppDataSource.getRepository("Role");

const roleResolvers = {
    Query: {
        roles: async () => {
            return await roleRepository.find();
        },

    },

    Mutation: {
        createRole: async (_, { name, description }) => {
            const newRole = roleRepository.create({ name, description });
            return await roleRepository.save(newRole);
        },

    },
};

module.exports = roleResolvers;
