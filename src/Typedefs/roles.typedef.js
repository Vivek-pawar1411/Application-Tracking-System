
// This file defines the GraphQL type definitions for roles in the application.
// It includes the Role type, queries to fetch roles, and mutations to create roles.
const { gql } = require('apollo-server-express');

const roleTypeDefs = gql`
  type Role {
    id: ID!
    name: String!
    description: String
    created_at: String
    updated_at: String
  }

  extend type Query {
    roles: [Role]
    rolesbyid(id: ID!): Role
  }

  extend type Mutation {
    
    createRole(name: String!, description: String): Role       
  }
`;

module.exports = roleTypeDefs;
