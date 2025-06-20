const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type user {
    id: ID!
    firstName: String!           
    lastName: String!            
    email: String!
    password: String!
    role_names: [String!]!
    countryCode: String!         
    mobileNo: String!                          
    userType: String!            
    status: Boolean!             
    is_blocked: Boolean!         
    created_at: String!
    updated_at: String!          
    deletedAt: String            
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
    firstName: String            
    lastName: String             
    email: String
    password: String
    countryCode: String          
    mobileNo: String                           
    userType: String             
    status: Boolean              
    is_blocked: Boolean          
  }

  type Query {
    users: [user]
    userbyid(id: ID!): user
  }

  type Mutation {
    addUser(
      firstName: String!,lastName: String!,email: String!,password: String!,roleIds: [Int!]!
       countryCode: String!,mobileNo: String!  ,userType: String): user
    login(email: String!, password: String!): user
    updateUser(id: ID!, input: UpdateUserInput!): user
    deleteUser(id: ID!): String
    sendotp(email: String!): OTPResponse
    verifyotp(email: String!, otp: String!): VerifyOTPResponse
  }
`;

module.exports = typeDefs;
