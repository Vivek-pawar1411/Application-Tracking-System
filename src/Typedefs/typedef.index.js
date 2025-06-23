
// This file is used to merge all the GraphQL type definitions into a single schema.
const { mergeTypeDefs } = require('@graphql-tools/merge');
const userTypeDef = require('./user.typedef');
const roleTypeDefs = require('./roles.typedef');
const permissiontypedef = require('./permission.typedef');
const tokenTypeDefs = require('./token.typedef');

const typeDefs = mergeTypeDefs([userTypeDef, roleTypeDefs, permissiontypedef, tokenTypeDefs]);



module.exports = {typeDefs};
