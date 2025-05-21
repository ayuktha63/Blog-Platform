const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { connectDB } = require('./db');

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  try {
    await connectDB();
    const { url } = await server.listen({ port: 4000 });
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.error('Server startup error:', error);
  }
}

startServer();