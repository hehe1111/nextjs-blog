import Head from 'next/head';
import type { AppProps } from 'next/app';
import styled from 'styled-components';
import 'github-markdown-css';
import 'highlight.js/styles/github.css';
import 'frontend/styles/global.css';

const Container = styled.div`
  height: 100%;
  padding: 16px;
`;

// https://www.nextjs.cn/docs/basic-features/typescript#custom-app
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Container>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
      </Head>

      <Component {...pageProps} />
    </Container>
  );
}
