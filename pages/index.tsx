import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { Post } from 'src/entity/Post';

type IProps = {
  posts: Post[];
};

const Home: NextPage<IProps> = props => {
  return (
    <div className="container">
      <Head>
        <title>All post</title>
      </Head>

      <main>
        {props.posts.map(post => (
          <p key={post.id}>{post.title}</p>
        ))}
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async context => {
  const connection = await getDatabaseConnection();
  const posts = await connection.manager.find(Post);
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};
