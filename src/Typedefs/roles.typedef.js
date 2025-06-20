const { gql } = require('apollo-server-express');

const roleTypeDefs = gql`
  type Role {
    id: ID!
    name: String!
    slug: String!
    description: String
    status: Boolean!
    userType: String!
    created_at: String
    updated_at: String
    deleted_at: String
  }

  input CreateRoleInput {
    name: String!
    description: String
    status: Boolean!
    userType: String!
  }

  input UpdateRoleInput {
  name: String
  description: String
  status: Boolean
  userType: String
}


  extend type Query {
    roles: [Role]
    roleById(id: ID!): Role
    roleBySlug(slug: String!): Role
  }

  extend type Mutation {
    createRole(input: CreateRoleInput!): Role
    deleteRole(id: ID!): String
    updateRole(id: ID!, input: UpdateRoleInput!): Role
  }
`;

module.exports = roleTypeDefs;
