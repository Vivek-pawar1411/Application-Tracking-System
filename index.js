//main file for the server (Index.js)
const express = require('express'); // Import the Express framework to create the HTTP server
const {typeDefs} = require('./src/Typedefs/typedef.index'); // Import GraphQL type definitions (schema)
const resolvers = require('./src/Resolver/resolver.index');// Import GraphQL resolvers (functions to handle the queries/mutations)
const { ApolloServer } = require('@apollo/server'); // Import ApolloServer for integrating GraphQL with Express
const { expressMiddleware } = require('@apollo/server/express4'); // Apollo middleware to connect ApolloServer with Express v4
const cors = require('cors');  // Enable Cross-Origin Resource Sharing to allow requests from different domains
const { AppDataSource } = require('./src/database/db'); // Import the configured TypeORM DataSource to connect to the database
const { getUserFromToken } = require('./src/Middleware/auth.middleware'); // Import function to extract and verify user from JWT token


// Async function to start the server
async function startServer() {
  try {
    const app = express();
    app.use(express.json());     // Middleware to parse incoming JSON requests
    app.use(cors());             // Enable CORS for all routes

    await AppDataSource.initialize();     // Initialize TypeORM database
    console.log('✅ Database connected successfully');

    const server = new ApolloServer({ typeDefs, resolvers, });
    // Start the Apollo server
    await server.start();
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }) => {
          const authHeader = req.headers.authorization || '';
          const user = getUserFromToken(authHeader);
            return { user: user || null }; // ✅ always return 'user'
        }
      })
    );
    // Start the Express server on port 5000
    app.listen(5000, () => {
      console.log('🚀  Server is running on port 5000');
      console.log('🌐 GraphQL endpoint: http://localhost:5000/graphql');
    });
  } catch (error) {
    console.error('❌ Error starting the server:', error.message);
  }
}

startServer();
