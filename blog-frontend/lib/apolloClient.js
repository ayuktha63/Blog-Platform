// lib/apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',  // Update if your backend URL differs
  cache: new InMemoryCache(),
});

export default client;
