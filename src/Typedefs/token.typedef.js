const { gql } = require('apollo-server-express');

const tokentypeDefs = gql`
  type Token {
    id: ID!
    token: String!
    userId: Int!
    isBlacklisted: Boolean!
    createdAt: String!
    expiresAt: String
    expires: Boolean!   # ✅ newly added field
  }
  type LogoutResponse {
  success: Boolean!
  message: String!
}



  type Query {
    alltoken: [Token]
    tokenById(userId: ID!): [Token!]!
  }

      type Mutation {
    logout(token: String!): LogoutResponse!
  }


`;

module.exports = tokentypeDefs;
