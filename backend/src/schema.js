const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    _id: ID!
    title: String!
    content: String!
    author: String!
    createdAt: String
  }

  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!, author: String!): Post
    deletePost(id: ID!): Boolean
    deleteAllPosts: Boolean
  }
`;

module.exports = typeDefs;
