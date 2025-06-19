// This file defines the GraphQL resolvers for the Role entity.
// Description: This file defines the GraphQL resolvers for the Role entity.

// const { AppDataSource } = require("../database/db"); // Adjust path as needed
// const { Role } = require("../Entity/roles.entity"); // Adjust path as needed

// const roleRepository = AppDataSource.getRepository("Role");

// const roleResolvers = {
//   Query: {
//     // Fetch all roles
//     // This resolver fetches all roles from the database.
//     roles: async () => {
//       return await roleRepository.find();
//     },

//     rolesbyid: async (_, { id }) => {
//       return await roleRepository.findOne({ where: { id } });
//     },
//   },
//   // Mutation resolvers for Role entity
//   Mutation: {
//     // Create a new role
//     createRole: async (_, { name, description }) => {
//       // Manual validation
//       if (!name || name.trim().length < 3) {
//         throw new Error("Role name must be at least 3 characters long");
//       }

//       if (description && typeof description !== "string") {
//         throw new Error("Description must be a string");
//       }
//       const newRole = roleRepository.create({ name, description });

//       return await roleRepository.save(newRole);
//     },
//   },
// };

// module.exports = roleResolvers;


const { AppDataSource } = require("../database/db");
const { Role } = require("../Entity/roles.entity");

const roleRepository = AppDataSource.getRepository("Role");

const roleResolvers = {
  Query: {
    // Fetch all roles
    roles: async () => {
      return await roleRepository.find();
    },

    // Fetch role by ID
    rolesById: async (_, { id }) => {
      return await roleRepository.findOne({ where: { id } });
    },
  },

  Mutation: {
    // Create a new role with all required fields
    createRole: async (
      _,
      { name, slug, secondary, description, status, userType }
    ) => {
      // Validations
      if (!name || name.trim().length < 3) {
        throw new Error("Role name must be at least 3 characters long");
      }

      if (!slug || slug.trim().length < 3) {
        throw new Error("Slug is required and must be at least 3 characters long");
      }

      if (typeof secondary !== "boolean") {
        throw new Error("Secondary must be a boolean");
      }

      if (typeof status !== "boolean") {
        throw new Error("Status must be a boolean");
      }

      if (!userType || userType.trim().length === 0) {
        throw new Error("UserType is required");
      }

      if (description && typeof description !== "string") {
        throw new Error("Description must be a string");
      }

      const newRole = roleRepository.create({
        name,
        slug,
        secondary,
        description,
        status,
        userType,
      });

      return await roleRepository.save(newRole);
    },
  },
};

module.exports = roleResolvers;

