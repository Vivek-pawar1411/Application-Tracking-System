// This file defines the GraphQL type definitions for user-related operations.
// It includes the User type, queries to fetch users, and mutations for adding users and logging in.

const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type user {
    id: ID!
    name: String!
    email: String!
    password: String!
    role_names: [String!]! 
    contact: String
    created_at: String!
    token: String
  }

  input UpdateUserInput {
  name: String
  email: String
  password: String
  contact: String
}

  type Query {
    users: [user]
    userbyid(id: ID!): user
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!, roleIds: [Int!]!,contact:String): user
    login(email: String!, password: String!): user
    updateUser(id: ID!, input: UpdateUserInput!): user
  }
`;

module.exports = typeDefs;
