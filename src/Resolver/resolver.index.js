// Description: This file merges all the resolvers for the GraphQL schema.
const { mergeResolvers } = require('@graphql-tools/merge');
const userResolvers = require('./user.resolver');
const roleResolvers = require('./roles.resolver');
const permissionResolvers = require('./permission.resolver');
const tokenResolvers = require('./token.resolver');
const jobsResolvers = require('./jobs.resolver');
const meetingResolvers = require('./meeting.resolver');

const resolvers = mergeResolvers([userResolvers, roleResolvers,
                     permissionResolvers,tokenResolvers, jobsResolvers, meetingResolvers]);




module.exports = resolvers;

