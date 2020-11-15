import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { AxiosResponse } from 'axios';
import client from 'frontend/client';
import { withSession } from 'backend/withSession';

const SignIn: NextPage = () => {
  const [info, setInfo] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({
    username: [] as string[],
    password: [] as string[],
  });
  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      client.post('/api/v1/sessions', info).then(
        () => {
          alert('登录成功');
          window.location.href = '/';
        },
        error => {
          if (error.response) {
            const response: AxiosResponse = error.response;
            response.status === 422 && setErrors(response.data);
          }
        }
      );
    },
    [info]
  );

  return (
    <>
      <Head>
        <title>登录</title>
      </Head>

      <h1>登录</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>用户名</label>
          <input
            type="text"
            onChange={event => {
              setInfo({ ...info, username: event.target.value });
            }}
          />
          {errors.username?.length > 0 && <p>{errors.username.join('，')}</p>}
        </div>
        <div>
          <label>密码</label>
          <input
            type="password"
            onChange={event => {
              setInfo({ ...info, password: event.target.value });
            }}
          />
          {errors.password?.length > 0 && <p>{errors.password.join('，')}</p>}
        </div>
        <div>
          <button type="submit">登录</button>
        </div>
      </form>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    // @ts-ignore
    const user = context.req.session.get('currentUser');
    return {
      props: {
        user: user ? JSON.parse(JSON.stringify(user)) : null,
      },
    };
  }
);
