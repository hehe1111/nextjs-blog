import { NextPage, GetServerSidePropsContext, GetServerSideProps } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { withSession } from 'backend/withSession';
import { Post } from 'db/src/entity/Post';
import { User } from 'db/src/entity/User';
import { default as _PostDate } from 'frontend/components/PostDate';
import Md from 'frontend/components/Md';

type IProps = {
  post: Post;
  user: User | null;
};

const PostTitle = styled.h1`
  margin: 20px 0;
  text-align: center;
`;
const PostDate = styled(_PostDate)`
  text-align: center;
`;
const PostContent = styled(Md)`
  max-width: 1000px;
  margin: 40px auto 100px auto;
  @media (max-width: 800px) {
    padding: 0;
  }
  @media (min-width: 700px) {
    &.markdown-body {
      font-size: 24px;
    }
  }
`;

const ThePost: NextPage<IProps> = ({ post }) => (
  <>
    <Head>
      <title>{post.title}</title>
    </Head>

    <PostTitle>{post.title}</PostTitle>
    <PostDate date={post.createdAt} />
    <PostContent string={post.content} />
  </>
);

export default ThePost;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext<{ id: string }>) => {
    const connection = await getDatabaseConnection();
    const post = await connection.manager.findOne<Post>(
      'Post',
      context.params.id
    );

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  }
);
