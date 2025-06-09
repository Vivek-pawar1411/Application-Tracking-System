const { gql } = require('apollo-server-express'); 

const typeDefs = gql`

  type user {
    id: ID!
    name: String!
    email: String!
    password: String!
    role_names: [String!]! 
    created_at: String!
    token: String
  }

  type Query {
    users: [user]
    userbyid(id: ID!): user
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!, roleIds: [Int!]!): user
    login(email: String!, password: String!): user
  }
`;

module.exports = typeDefs;
