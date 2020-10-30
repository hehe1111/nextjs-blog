import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { Post } from 'src/entity/Post';

type IProps = {
  post: Post;
};

const ThePost: NextPage<IProps> = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <h1>{post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
    </>
  );
};

export default ThePost;

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async context => {
  const connection = await getDatabaseConnection();
  const post = await connection.manager.findOne(Post, context.params.id);
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
