import { GetServerSidePropsContext, NextPage } from 'next';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { AxiosError, AxiosResponse } from 'axios';
import { Post } from 'db/src/entity/Post';
import { User } from 'db/src/entity/User';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { withSession } from 'backend/withSession';
import Button from 'frontend/components/Button';
import { AvatarAndName, Avatar, Name } from 'frontend/components/AvatarAndName';
import client from 'frontend/client';
import useAuth from 'frontend/hooks/useAuth';

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
  useAuth(user);
  const [comments, setComments] = useState(post.comments);
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
            <AvatarAndName>
              <Avatar />
              <Name>{c.username}</Name>
              <span>：</span>
            </AvatarAndName>
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
