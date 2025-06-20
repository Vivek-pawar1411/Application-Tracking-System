// generateSchema.js
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { printSchema } = require('graphql');
const fs = require('fs');
const path = require('path');

// Import typedefs and resolvers
const {typeDefs} = require('./src/Typedefs/typedef.index'); // Import GraphQL type definitions (schema)
const  resolvers  = require('./src/Resolver/resolver.index'); // should export: { resolvers }

if (!typeDefs || !Array.isArray(typeDefs)) {
  throw new Error("❌ typeDefs must be a non-empty array in typedef.index.js");
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const printedSchema = printSchema(schema);

fs.writeFileSync(path.join(__dirname, 'schema.graphql'), printedSchema);
console.log("✅ schema.graphql generated!");
