import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AxiosError, AxiosResponse } from 'axios';
import { Post } from 'db/src/entity/Post';
import { User } from 'db/src/entity/User';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { withSession } from 'backend/withSession';
import Button from 'frontend/components/Button';
import { Name } from 'frontend/components/CommentsArea';
import client from 'frontend/client';

const Page = styled.div`
  max-width: 1000px;
  margin: 40px auto;
`;
const Row = styled.div`
  padding: 20px 0;
  word-break: break-all;
  border-bottom: 1px dashed var(--grey);
  &:hover {
    background-color: var(--lightGrey);
  }
`;
const NameAndDelete = styled.div`
  display: flex;
  align-items: center;
  & > div {
    flex: 1;
  }
`;

const PostComments: NextPage<{ post: Post; user: User }> = ({ post, user }) => {
  const [comments, setComments] = useState(post.comments);
  const router = useRouter();
  useEffect(() => {
    !user &&
      router.push(
        `/admin/sign-in?redirect=${encodeURIComponent(router.asPath)}`
      );
  }, []);

  const onDelete = useCallback(id => {
    client
      .delete('/api/v1/comment/delete', { data: { id } })
      .then((response: AxiosResponse) => alert(response.data.message))
      .then(() => client.post('/api/v1/comment/fetch', { id: post.id }))
      .then((response: AxiosResponse) => setComments(response.data))
      .catch((error: AxiosError) =>
        console.log(error.response.data.message, JSON.stringify(error))
      );
  }, []);

  return !user ? (
    <>请先登录</>
  ) : (
    <Page>
      <p>
        文章名：<strong>{post.title}</strong>
      </p>
      <p>评论（{comments.length}）</p>
      {comments.map(c => (
        <Row key={c.id}>
          <NameAndDelete>
            <div>
              <Name>{c.username}</Name>
              <span>：</span>
            </div>
            <Button className="red" onClick={() => onDelete(c.id)}>
              删除
            </Button>
          </NameAndDelete>
          <p>{c.content}</p>
        </Row>
      ))}
    </Page>
  );
};

export default PostComments;

export const getServerSideProps = withSession(
  async (context: GetServerSidePropsContext<{ id: string }>) => {
    const { manager } = await getDatabaseConnection();
    const post = await manager.findOne<Post>('Post', {
      where: { id: context.params.id },
      relations: ['comments'],
    });

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        // @ts-ignore
        user: context.req.session.get('currentUser') || null,
      },
    };
  }
);
