// pages/_app.js
import '@/styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apolloClient';

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
