import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Post } from 'src/entity/Post';

type IProps = {
  posts: Post[];
};

const PostAll: NextPage<IProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>文章列表</title>
      </Head>

      <main>
        {posts.map(post => (
          <div key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <a>{post.title}</a>
            </Link>
          </div>
        ))}
      </main>
    </>
  );
};

export default PostAll;

export const getServerSideProps: GetServerSideProps = async context => {
  const connection = await getDatabaseConnection();
  const posts = await connection.manager.find(Post);
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};
