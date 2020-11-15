import { NextPage, GetServerSidePropsContext, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { useCallback } from 'react';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { withSession } from 'backend/withSession';
import { Post } from 'db/src/entity/Post';
import { User } from 'db/src/entity/User';
import Button from 'frontend/components/Button';
import PostDate from 'frontend/components/PostDate';
import client from 'frontend/client';
import Md from 'frontend/components/Md';

type IProps = {
  post: Post;
  user: User | null;
};

const PostTitle = styled.h1`
  margin: 20px 0;
  text-align: center;
`;
const TimeAndActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    margin-left: 16px;
  }
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

const ThePost: NextPage<IProps> = ({ post, user }) => {
  const router = useRouter();
  const onDelete = useCallback(() => {
    client
      .post('/api/v1/post/delete', { id: post.id })
      .then(response => {
        router.push('/posts/');
        alert(response.data.message);
      })
      .catch(error => {
        console.log('删除失败', JSON.stringify(error));
        alert('删除失败');
      });
  }, []);

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <PostTitle>{post.title}</PostTitle>
      <TimeAndActions>
        <PostDate date={post.createdAt} />
        {user && (
          <>
            <Link href={`/posts/${post.id}/edit`}>
              <a>
                <Button className="blue">修改文章</Button>
              </a>
            </Link>
            <Button className="red" onClick={onDelete}>
              删除文章
            </Button>
          </>
        )}
      </TimeAndActions>
      <PostContent string={post.content} />
    </>
  );
};

export default ThePost;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext<{ id: string }>) => {
    const connection = await getDatabaseConnection();
    const post = await connection.manager.findOne<Post>(
      'Post',
      context.params.id
    );
    // @ts-ignore
    const user = context.req.session.get('currentUser') || null;
    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        user,
      },
    };
  }
);
