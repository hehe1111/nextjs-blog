import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/posts');
  }, [router]);
  return (
    <>
      <Head>
        <title>博客首页</title>
      </Head>

      <main>
        <Link href="/posts">
          <a>查看文章列表</a>
        </Link>
      </main>
    </>
  );
};

export default Home;
