// This file defines the GraphQL resolvers for the Role entity.
// Description: This file defines the GraphQL resolvers for the Role entity.

const { AppDataSource } = require('../database/db'); // Adjust path as needed
const { Role } = require('../Entity/roles.entity'); // Adjust path as needed

const roleRepository = AppDataSource.getRepository("Role");

const roleResolvers = {
    Query: {
        // Fetch all roles
        // This resolver fetches all roles from the database.
        roles: async () => {
            return await roleRepository.find();
        },

    },
    // Mutation resolvers for Role entity
    Mutation: {
        // Create a new role
        createRole: async (_, { name, description }) => {
            const newRole = roleRepository.create({ name, description });
            return await roleRepository.save(newRole);
        },

    },
};

module.exports = roleResolvers;
