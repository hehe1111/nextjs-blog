import getDatabaseConnection from 'lib/getDatabaseConnection';
import { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Post } from 'src/entity/Post';
import styled from 'styled-components';

type IProps = {
  post: Post;
};

const PostTitle = styled.h1`
  margin-top: 20px;
  text-align: center;
`;
const PostTime = styled.div`
  margin-top: 8px;
  font-size: 0.8em;
  color: #aaa;
  text-align: center;
`;
const PostContent = styled.article`
  padding: 0 2em;
  margin: 20px 0;
  @media (max-width: 800px) {
    padding: 0;
  }
`;

const ThePost: NextPage<IProps> = ({ post }) => {
  const date = new Date(post.createdAt)
    .toLocaleDateString()
    .replace(/\//g, '-'); // WHY?

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <PostTitle>{post.title}</PostTitle>
      <PostTime>{date}</PostTime>
      <PostContent
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></PostContent>
    </>
  );
};

export default ThePost;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const connection = await getDatabaseConnection();
  const post = await connection.manager.findOne('Post', context.params?.id);
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};
