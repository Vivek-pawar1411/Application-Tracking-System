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
   
  type Role{
    id: ID!
    name: String!
    permissions: [Permission]
  }


  input CreatePermissionInput {
    name: String!
    description: String
  }

  extend type Query {
    permissions: [Permission]
    permission(id: ID!): Permission
    roleswithPermissions(id: ID!): Role
  }

  extend type Mutation {
    assignPermissionToRole(roleId: ID!, permissionIds: [ID!]!): Role
    createPermission(input: CreatePermissionInput!): Permission
    # //updatePermission(id: ID!, input: CreatePermissionInput!): Permission
    deletePermission(id: ID!): String
  }
`;

module.exports = { permissiontypedef };
