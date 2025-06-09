const { mergeTypeDefs } = require('@graphql-tools/merge');
const userTypeDef = require('./user.typedef');
const roleTypeDefs = require('./roles.typedef');

const typeDefs = mergeTypeDefs([userTypeDef, roleTypeDefs]);



module.exports = typeDefs;
