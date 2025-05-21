import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      _id
      title
      author
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $author: String!) {
    createPost(title: $title, content: $content, author: $author) {
      _id
      title
      author
    }
  }
`;

export default function Home() {
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  const [createPost] = useMutation(CREATE_POST);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', content: '' });
  const [submitError, setSubmitError] = useState('');

  if (loading) return <p className="text-center text-gray-500 text-lg animate-pulse">Loading...</p>;
  if (error) return <p className="text-center text-red-500 text-lg">Error: {error.message}</p>;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError('');

    if (!form.title || !form.author || !form.content) {
      setSubmitError('All fields are required.');
      return;
    }

    try {
      await createPost({ variables: { ...form } });
      setForm({ title: '', author: '', content: '' });
      setModalOpen(false);
      refetch();
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Blog Haven</h1>
          <p className="mt-3 text-lg text-gray-600">Discover stories, ideas, and insights.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Create New Post
          </button>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.posts.map(post => (
            <li
              key={post._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link href={`/post/${post._id}`} className="block p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600">By {post.author}</p>
              </Link>
            </li>
          ))}
        </ul>
        {modalOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a New Post</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    rows={6}
                    placeholder="Write your post content"
                    required
                  />
                </div>

                {submitError && (
                  <p className="text-red-500 text-sm">{submitError}</p>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}