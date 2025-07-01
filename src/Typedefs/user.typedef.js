const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type user {
    id: ID!
    firstName: String!           
    lastName: String!            
    email: String!
    password: String!
    role_names: [String!]!
    mobileNo: String!                          
    userType: String!                        
    is_blocked: Boolean!         
    created_at: String!
    updated_at: String!                    
    token: String
  } 
   type UsersListResponse {
    data: [user]!
    pagination: PaginationInfo!
   filters: UserFilterInfo!
  }

  type UserFilterInfo {
    search: String
    isverified: Boolean
    userType: user
    roleId: Int
    sortBy: String!
    sortOrder: String!
  }
     type BlockUserResponse {
    message: String!
    user: user!
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
      usersList(
      page: Int = 1
      limit: Int = 10
      search: String
      isverified: Boolean
      userType: String
      roleId: Int
      sortBy: String = "created_at"
      
    ): UsersListResponse!
    userbyid(id: ID!): user
  }

  type Mutation {
    addUser(
      firstName: String!,lastName: String!,email: String!,password: String!,roleIds: [Int!]!
     ,mobileNo: String!  ,userType: String): user
    login(email: String!, password: String!): user
    updateUser(id: ID!, input: UpdateUserInput!): user
    deleteUser(id: ID!): String
    sendotp(email: String!): OTPResponse
    verifyotp(email: String!, otp: String!): VerifyOTPResponse
    blockUser(userId: Int!, block: Boolean!): BlockUserResponse
  }
`;

module.exports = typeDefs;
