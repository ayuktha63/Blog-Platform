const { getDB } = require('./db');
const { ObjectId } = require('mongodb');

const resolvers = {
  Query: {
    posts: async () => {
      try {
        return await getDB().collection('posts').find().toArray();
      } catch (error) {
        throw new Error('Error fetching posts: ' + error.message);
      }
    },

    post: async (_, { id }) => {
      try {
        const post = await getDB().collection('posts').findOne({ _id: new ObjectId(id) });
        if (!post) throw new Error('Post not found');
        return post;
      } catch (error) {
        throw new Error('Error fetching post: ' + error.message);
      }
    },
  },

  Mutation: {
    createPost: async (_, { title, content, author }) => {
      title = title.trim();
      content = content.trim();
      author = author.trim();

      if (!title || !content || !author) {
        throw new Error('All fields (title, content, author) must be non-empty.');
      }

      const post = {
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
      };

      try {
        const result = await getDB().collection('posts').insertOne(post);
        return {
          _id: result.insertedId,
          ...post,
        };
      } catch (error) {
        throw new Error('Error creating post: ' + error.message);
      }
    },

    deletePost: async (_, { id }) => {
      try {
        const result = await getDB().collection('posts').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          throw new Error('Post not found or already deleted');
        }
        return true;
      } catch (error) {
        throw new Error('Error deleting post: ' + error.message);
      }
    },

    deleteAllPosts: async () => {
      try {
        const result = await getDB().collection('posts').deleteMany({});
        // You can optionally check deletedCount here if you want
        return true;
      } catch (error) {
        throw new Error('Error deleting all posts: ' + error.message);
      }
    },
  },
};

module.exports = resolvers;
