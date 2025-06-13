const { gql } = require("apollo-server-express");

const permissiontypedef = gql`
  type Permission {
    id: ID!
    name: String!
    description: String
    created_at: String
    updated_at: String
    roles: [Role]
  }

  input CreatePermissionInput {
    name: String!
    description: String
  }

  extend type Query {
    permissions: [Permission]
    permission(id: ID!): Permission
  }

  extend type Mutation {
    createPermission(input: CreatePermissionInput!): Permission
    updatePermission(id: ID!, input: CreatePermissionInput!): Permission
    deletePermission(id: ID!): String
  }
`;

module.exports = { permissiontypedef };
