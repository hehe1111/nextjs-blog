import { NextPage, GetServerSidePropsContext, GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { withSession } from 'backend/withSession';
import { Post } from 'db/src/entity/Post';
import PostDate from 'frontend/components/PostDate';
import Md from 'frontend/components/Md';
import CommentsArea from 'frontend/components/CommentsArea';
import _Small from 'frontend/components/Small';
import client from 'frontend/client';

const Page = styled.div`
  position: relative;
`;
const NavBar = styled.div`
  width: 100%;
  padding: 8px 16px;
  background-color: var(--white);
  box-shadow: 0 0 4px 4px var(--grey);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
`;
const PostTitle = styled.h1`
  margin: 80px 0 20px 0;
  text-align: center;
`;
const Small = styled(_Small)`
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    margin: 0 10px;
  }
`;
const ContentAndComments = styled.div`
  max-width: 1000px;
  margin: 40px auto 100px auto;
`;
const TheEnd = styled(_Small)`
  margin: 80px 0 60px 0;
  position: relative;
  text-align: center;
  &::before,
  &::after {
    content: '';
    width: 35%;
    height: 2px;
    background-color: var(--grey);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  &::before {
    left: 0;
  }
  &::after {
    right: 0;
  }
`;

const ThePost: NextPage<{ post: Post }> = ({ post }) => {
  const countSuccess = useRef(true);
  useEffect(() => {
    post.pageView += 1;
    client
      .post('/api/v1/comment/count', { id: post.id, pageView: post.pageView })
      .catch(() => (countSuccess.current = false));
  }, [post]);

  return (
    <Page>
      <Head>
        <title>{post.title}</title>
      </Head>

      <NavBar>
        <Link href="/posts">
          <a>全部文章</a>
        </Link>
      </NavBar>
      <PostTitle>{post.title}</PostTitle>
      <Small>
        <PostDate date={post.createdAt} />
        <span>字数：{post.content.length}</span>
        <span>阅读：{post.pageView + (countSuccess ? 1 : 0)}</span>
      </Small>
      <ContentAndComments>
        <Md string={post.content} />
        <TheEnd>~ 全文完 ~</TheEnd>
        <CommentsArea post={post} />
      </ContentAndComments>
    </Page>
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
