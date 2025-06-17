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

  type OTPResponse {
    message: String!
    status: Boolean!
  }

  type VerifyOTPResponse {
    message: String!
    verified: Boolean!
    user: user!
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
    addUser(name: String!, email: String!, password: String!, roleIds: [Int!]!, contact: String): user
    login(email: String!, password: String!): user
    updateUser(id: ID!, input: UpdateUserInput!): user
    deleteUser(id: ID!): String
    sendotp(email: String!): OTPResponse
    verifyotp(email: String!, otp: String!): VerifyOTPResponse
  }
`;

module.exports = typeDefs;
