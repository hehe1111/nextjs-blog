import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { AxiosResponse } from 'axios';
import client from 'frontend/client';

type IFormData = {
  username: string;
  password: string;
  passwordConfirmation?: string;
};
type IProps = {
  initialFormData: IFormData;
  url: string;
  successRoute: string;
  type: '注册' | '登录';
};

const useSignUpOrSignIn = ({
  initialFormData,
  url,
  successRoute,
  type,
}: IProps) => {
  const [formData, setFormData] = useState(initialFormData);

  const _errors: { [key in keyof IFormData]?: string[] } = {};
  Object.keys(formData).forEach(key => (_errors[key] = [] as string[]));
  const [errors, setErrors] = useState(_errors);

  const router = useRouter();
  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      client.post(url, formData).then(
        () => {
          alert(`${type}成功`);
          router.push(successRoute);
        },
        error => {
          if (error.response) {
            const response: AxiosResponse = error.response;
            response.status === 422 && setErrors(response.data);
          }
        }
      );
    },
    [formData]
  );

  return (
    <>
      <Head>
        <title>{type}</title>
      </Head>

      <h1>{type}</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>用户名</label>
          <input
            type="text"
            onChange={event => {
              setFormData({ ...formData, username: event.target.value });
            }}
          />
          {errors.username.length > 0 && <p>{errors.username.join('，')}</p>}
        </div>
        <div>
          <label>密码</label>
          <input
            type="password"
            onChange={event => {
              setFormData({ ...formData, password: event.target.value });
            }}
          />
          {errors.password.length > 0 && <p>{errors.password.join('，')}</p>}
        </div>
        {formData.passwordConfirmation !== undefined && (
          <div>
            <label>确认密码</label>
            <input
              type="password"
              onChange={event => {
                setFormData({
                  ...formData,
                  passwordConfirmation: event.target.value,
                });
              }}
            />
            {errors.passwordConfirmation.length > 0 && (
              <p>{errors.passwordConfirmation.join('，')}</p>
            )}
          </div>
        )}

        <button type="submit">{type}</button>
      </form>
    </>
  );
};

export default useSignUpOrSignIn;
