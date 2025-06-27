const { gql } = require("apollo-server-express");

const jobTypeDefs = gql`
  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
  }

  type Job {
    id: ID!
    title: String!
    description: String!
    department: String!
    location: String!
    experience: String!
    salary: Float!
    vacancy: Int!
    status: Boolean
    posted_date: String!
    closing_date: String
    created_at: String
    created_by: User!
  }

  input CreateJobInput {
    title: String!
    description: String!
    department: String!
    location: String!
    experience: String!
    salary: Float!
    vacancy: Int!
    status: Boolean
    posted_date: String!
    closing_date: String
    created_by: Int!
  }

  input UpdateJobInput {
    title: String
    description: String
    department: String
    location: String
    experience: String
    salary: Float
    vacancy: Int
    status: Boolean
    posted_date: String
    closing_date: String
  }

  type JobPagination {
    data: [Job!]!
    pagination: PaginationInfo!
    filters: JobFilterInfo
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

  type JobFilterInfo {
    search: String
    department: String
    location: String
    status: Boolean
    sortBy: String
    sortOrder: String
  }

  extend type Query {
    jobList(
      page: Int
      limit: Int
      search: String
      department: String
      location: String
      status: Boolean
      sortBy: String
      sortOrder: String
    ): JobPagination!

    jobById(id: ID!): Job
  }

  extend type Mutation {
    createJob(data: CreateJobInput!): Job!
    updateJob(id: ID!, data: UpdateJobInput!): Job!
    deleteJob(id: ID!): Boolean!
  }
`;

module.exports = jobTypeDefs;
