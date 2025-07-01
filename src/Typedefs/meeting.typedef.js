const { gql } = require("apollo-server-express");

const meetingTypeDefs = gql`
  type Meeting {
    id: Int!
    title: String!
    agenda: String
    scheduledAt: String!
    durationMinutes: Int
    location: String
    created_at: String
    updated_at: String
    createdBy: User
    attendees: [User]
  }

  input MeetingInput {
    title: String!
    agenda: String
    scheduledAt: String!
    durationMinutes: Int
    location: String
    createdById: Int!
    attendeeIds: [Int]
  }

  input MeetingUpdateInput {
    title: String
    agenda: String
    scheduledAt: String
    durationMinutes: Int
    location: String
    attendeeIds: [Int]
  }

  type Query {
    meetings: [Meeting]
    meeting(id: Int!): Meeting
  }

  type Mutation {
    createMeeting(input: MeetingInput!): Meeting
    updateMeeting(id: Int!, input: MeetingUpdateInput!): Meeting
    deleteMeeting(id: Int!): String
  }
`;

module.exports =  meetingTypeDefs ;
