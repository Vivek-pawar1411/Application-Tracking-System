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
    rolesList(
    page: Int = 1
    limit: Int = 10
    search: String
    status: Boolean
    userType: String
    sortBy: String = "created_at"
    sortOrder: String = "DESC"
  ): RolesListResponse!
  }




type RolesListResponse {
  data: [Role!]!
  pagination: PaginationInfo!
  filters: FilterInfo!
}

type PaginationInfo {
  currentPage: Int!
  limit: Int!
  totalCount: Int!
  totalPages: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  nextPage: Int
  previousPage: Int
}

type FilterInfo {
  search: String
  status: Boolean
  userType: String
  sortBy: String!
  sortOrder: String!
}

  extend type Mutation {
    createRole(input: CreateRoleInput!): Role
    deleteRole(id: ID!): String
    updateRole(id: ID!, input: UpdateRoleInput!): Role
  }
`;

module.exports = roleTypeDefs;
