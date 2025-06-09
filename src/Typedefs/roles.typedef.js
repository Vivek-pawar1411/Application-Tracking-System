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
  }

  extend type Mutation {
    createRole(name: String!, description: String): Role       
  }
`;

module.exports = roleTypeDefs;
