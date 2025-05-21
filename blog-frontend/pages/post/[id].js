import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      _id
      title
      content
      author
    }
  }
`;

export default function Post() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id },
    skip: !id,
  });

  if (loading) return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <p className="text-center text-[var(--neutral)] text-xl animate-pulse font-medium">Loading...</p>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <p className="text-center text-red-600 text-xl font-medium">Error: {error.message}</p>
    </div>
  );
  if (!data?.post) return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <p className="text-center text-[var(--neutral)] text-xl font-medium">Post not found.</p>
    </div>
  );

  const { title, content, author } = data.post;
  // Mocked publication date (since not in GraphQL schema)
  const publicationDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <header className="sticky top-0 bg-[var(--background)] border-b border-[var(--border)] py-4 z-10">
        <div className="container flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[var(--title-color)]">
            Blog Haven
          </Link>
          <nav>
            <Link href="/" className="text-[var(--neutral)] hover:text-[var(--primary)] transition-colors duration-200">
              Home
            </Link>
          </nav>
        </div>
      </header>
      <div className="container py-16">
        <div className="card p-8 sm:p-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--title-color)] mb-6 tracking-tight">{title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center text-secondary mb-8 text-lg font-medium space-y-2 sm:space-y-0 sm:space-x-4">
            <p>By {author}</p>
            <span className="hidden sm:inline text-[var(--border)]">|</span>
            <p>{publicationDate}</p>
          </div>
          <div className="prose prose-lg max-w-none text-[var(--foreground)] prose-headings:text-[var(--foreground)] prose-p:text-[var(--neutral)] prose-a:text-[var(--primary)] hover:prose-a:text-[var(--primary-hover)] leading-relaxed">
            {content}
          </div>
          <div className="mt-12 flex justify-start">
            <Link href="/" className="btn-primary inline-flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}