import { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import axios from 'axios';

const PostCreate: NextPage = () => {
  const [info, setInfo] = useState({
    title: '',
    content: '',
  });
  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      axios.post('/api/v1/post/create', info).then(
        response => {
          console.log('新增博客成功', response);
          // alert('登录成功');
          // window.location.href = '/';
        },
        error => {
          console.log('新增博客失败', error);

          // if (error.response) {
          //   const response: AxiosResponse = error.response;
          //   response.status === 422 && setErrors(response.data);
          // }
        }
      );
    },
    [info]
  );
  return (
    <>
      <Head>
        <title>新增博客</title>
      </Head>

      <h1>新增博客</h1>

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
          <button type="submit">提交</button>
        </div>
      </form>
    </>
  );
};

export default PostCreate;
