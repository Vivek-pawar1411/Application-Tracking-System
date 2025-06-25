const {gql}= require('apollo-server-express');

const tokentypeDefs = gql`
  type Token {
    id: ID!
    token: String!
    userId: Int!
    isBlacklisted: Boolean!
    createdAt: String!
    expiresAt: String
  }

  

  type Query {
    alltoken: [Token!]!
    tokenById(userId: ID!): [Token!]!
  }

 
`;

module.exports =  tokentypeDefs ;