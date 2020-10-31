import { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

const SignUp: NextPage = () => {
  const [info, setInfo] = useState({
    username: '',
    password: '',
    passwordConfirmation: '',
  });
  const [errors, setErrors] = useState({
    username: [] as string[],
    password: [] as string[],
    passwordConfirmation: [] as string[],
  });
  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      axios.post('/api/v1/user', info).then(
        () => alert('注册成功'),
        error => {
          if (error.response) {
            const response: AxiosResponse = error.response;
            response.status === 422 &&
              setErrors({ ...errors, ...response.data });
          }
        }
      );
    },
    [info]
  );

  return (
    <>
      <Head>
        <title>注册</title>
      </Head>

      <p>{JSON.stringify(info)}</p>
      <h1>注册</h1>
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
          <label>确认密码</label>
          <input
            type="password"
            onChange={event => {
              setInfo({ ...info, passwordConfirmation: event.target.value });
            }}
          />
          {errors.passwordConfirmation?.length > 0 && (
            <p>{errors.passwordConfirmation.join('，')}</p>
          )}
        </div>
        <div>
          <button type="submit">注册</button>
        </div>
      </form>
    </>
  );
};

export default SignUp;
