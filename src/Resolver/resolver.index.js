// Description: This file merges all the resolvers for the GraphQL schema.
const { mergeResolvers } = require('@graphql-tools/merge');
const userResolvers = require('./user.resolver');
const roleResolvers = require('./roles.resolver');

const resolvers = mergeResolvers([userResolvers, roleResolvers]);




module.exports = resolvers;
