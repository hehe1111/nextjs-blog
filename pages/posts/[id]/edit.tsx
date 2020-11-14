import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import client from 'frontend/client';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import { Post } from 'db/src/entity/Post';

type IProps = {
  post: Post;
};

const PostEdit: NextPage<IProps> = ({ post }) => {
  const [info, setInfo] = useState({
    title: post.title || '',
    content: post.content || '',
    id: post.id,
  });
  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      if (info.title === '' || info.content === '') {
        return alert('标题和内容均不能为空');
      }
      client.post('/api/v1/post/edit', info).then(
        response => {
          alert('修改成功');
          window.location.replace(`/posts/${post.id}`);
        },
        error => console.log(error.response.data.message)
      );
    },
    [info]
  );
  return (
    <>
      <Head>
        <title>修改文章</title>
      </Head>

      <h1>修改文章</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label>标题</label>
          <input
            type="text"
            value={info.title}
            onChange={event => setInfo({ ...info, title: event.target.value })}
          />
        </div>

        <div>
          <label>内容</label>
          <textarea
            name="content"
            id="content"
            cols={50}
            rows={10}
            value={info.content}
            onChange={event =>
              setInfo({ ...info, content: event.target.value })
            }
          ></textarea>
        </div>
        <div>
          <button type="submit">提交</button>
        </div>
      </form>
    </>
  );
};

export default PostEdit;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
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
};
