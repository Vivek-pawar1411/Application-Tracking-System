// const { gql } = require("apollo-server-express");

// const permissiontypedef = gql`
//   type Permission {
//     id: ID!
//     name: String!
//     description: String
//     created_at: String
//     updated_at: String
//     roles: [Role]
//   }
   
//   type Role{
//     id: ID!
//     name: String!
//     permissions: [Permission]
//   }


//   input CreatePermissionInput {
//     name: String!
//     description: String
//   }

//   extend type Query {
//     permissions: [Permission]
//     permission(id: ID!): Permission
//     roleswithPermissions(id: ID!): Role
//   }

//   extend type Mutation {
//     assignPermissionToRole(roleId: ID!, permissionIds: [ID!]!): Role
//     createPermission(input: CreatePermissionInput!): Permission
//     updatePermission(id: ID!, input: CreatePermissionInput!): Permission
//     deletePermission(id: ID!): String
//   }
// `;

// module.exports = { permissiontypedef };

const { gql } = require("apollo-server-express");

const permissiontypedef = gql`
  type Permission {
    id: ID!
    name: String!
    slug: String!
    permission_group: String!
    description: String
    created_at: String
    updated_at: String
    deleted_at: String
    roles: [Role]
  }

  type Role {
    id: ID!
    name: String!
    slug: String!
    description: String
    status: Boolean!
    userType: String!
    created_at: String
    updated_at: String
    permissions: [Permission]
  }

  input CreatePermissionInput {
    name: String!
    slug: String!
    permission_group: String!
    description: String
  }

  input UpdatePermissionInput {
    name: String
    slug: String
    permission_group: String
    description: String
  }

  input PermissionFilters {
    search: String
    permission_group: String
    sortBy: String
    sortOrder: String
    page: Int
    limit: Int
  }

  type PermissionPagination {
    currentPage: Int
    limit: Int
    totalCount: Int
    totalPages: Int
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    nextPage: Int
    previousPage: Int
  }

  type PermissionListResponse {
    data: [Permission]
    pagination: PermissionPagination
    filters: PermissionFiltersOutput
  }

  type PermissionFiltersOutput {
    search: String
    permission_group: String
    sortBy: String
    sortOrder: String
  }

  extend type Query {
    permissionList(
      page: Int
      limit: Int
      search: String
      permission_group: String
      sortBy: String
      sortOrder: String
    ): PermissionListResponse

    permission(id: ID!): Permission
    roleswithPermissions(id: ID!): Role
  }

  extend type Mutation {
    createPermission(input: CreatePermissionInput!): Permission
    updatePermission(id: ID!, input: UpdatePermissionInput!): Permission
    deletePermission(id: ID!): String
    assignPermissionToRole(roleId: ID!, permissionIds: [ID!]!): Role
  }
`;

module.exports = permissiontypedef;
