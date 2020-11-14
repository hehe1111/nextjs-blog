import { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import client from 'lib/client';

const PostCreate: NextPage = () => {
  const [info, setInfo] = useState({
    title: '',
    content: '',
  });
  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      if (info.title === '' || info.content === '') {
        return alert('标题和内容均不能为空');
      }
      client.post('/api/v1/post/create', info).then(
        response => window.location.replace('/posts/'),
        error => console.log(error.response.data.message)
      );
    },
    [info]
  );
  return (
    <>
      <Head>
        <title>新增文章</title>
      </Head>

      <h1>新增文章</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label>标题</label>
          <input
            type="text"
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
            onChange={event =>
              setInfo({ ...info, content: event.target.value })
            }
          ></textarea>
        </div>
        <div>
          <button type="submit">新增</button>
        </div>
      </form>
    </>
  );
};

export default PostCreate;
