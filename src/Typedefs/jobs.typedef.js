const { gql } = require("apollo-server-express");

const jobTypeDefs = gql`
      type User {
    id: ID!
    name: String
    email: String
    # Add more fields if needed
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
    created_by: user!  # assuming User type is defined
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
    created_by: Int!  # user ID
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

  type Query {
    allJobs: [Job!]!
    jobById(id: ID!): Job
  }

  type Mutation {
    createJob(data: CreateJobInput!): Job!
    updateJob(id: ID!, data: UpdateJobInput!): Job!
    deleteJob(id: ID!): Boolean!
  }
`;

module.exports = jobTypeDefs;
