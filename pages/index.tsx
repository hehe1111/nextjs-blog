import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Post } from 'src/entity/Post';

type IProps = {
  posts: Post[];
};

const AllPosts: NextPage<IProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>All posts</title>
      </Head>
      <main>
        {posts.map(post => (
          <p key={post.id}>
            <Link href={`/post/${post.id}`}>
              <a>{post.title}</a>
            </Link>
          </p>
        ))}
      </main>
    </>
  );
};

export default AllPosts;

export const getServerSideProps: GetServerSideProps = async context => {
  const connection = await getDatabaseConnection();
  const posts = await connection.manager.find(Post);
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};
