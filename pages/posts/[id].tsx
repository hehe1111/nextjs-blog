import { NextPage, GetServerSidePropsContext, GetServerSideProps } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { withSession } from 'backend/withSession';
import { Post } from 'db/src/entity/Post';
import { default as _PostDate } from 'frontend/components/PostDate';
import Md from 'frontend/components/Md';
import CommentsArea from 'frontend/components/CommentsArea';

const PostTitle = styled.h1`
  margin: 20px 0;
  text-align: center;
`;
const PostDate = styled(_PostDate)`
  text-align: center;
`;
const ContentAndComments = styled.div`
  max-width: 1000px;
  margin: 40px auto 100px auto;
`;
const PostContent = styled(Md)`
  @media (max-width: 800px) {
    padding: 0;
  }
  @media (min-width: 700px) {
    &.markdown-body {
      font-size: 24px;
    }
  }
`;

const ThePost: NextPage<{ post: Post }> = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <PostTitle>{post.title}</PostTitle>
      <PostDate date={post.createdAt} />
      <ContentAndComments>
        <PostContent string={post.content} />
        <CommentsArea post={post} />
      </ContentAndComments>
    </>
  );
};

export default ThePost;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext<{ id: string }>) => {
    const { manager } = await getDatabaseConnection();

    // https://github.com/typeorm/typeorm/issues/4566#issuecomment-722058110
    // 基于 id 查找文章，并基于 comments （ManyToOne 联系） 查找对应文章的全部评论
    const post = await manager.findOne<Post>('Post', {
      where: { id: context.params.id },
      relations: ['comments'],
    });

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  }
);
