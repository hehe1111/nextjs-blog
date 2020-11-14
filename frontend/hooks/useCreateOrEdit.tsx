import Head from 'next/head';
import { FormEvent, useCallback, useState } from 'react';
import client from 'frontend/client';
import { AxiosError, AxiosResponse } from 'axios';

type IProps = {
  initialFormData: { title: string; content: string; id?: number };
  url: string;
  onSuccess: (response: AxiosResponse) => void;
  type: '新增' | '修改';
};

const useCreateOrEdit = ({
  initialFormData,
  url,
  onSuccess,
  type,
}: IProps): JSX.Element => {
  const [formData, setFormData] = useState(initialFormData);
  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (formData.title === '' || formData.content === '') {
        return alert('标题和内容均不能为空');
      }
      client.post(url, formData).then(onSuccess, (error: AxiosError) => {
        console.log(error.response.data.message);
        alert(`${type}失败`);
      });
    },
    [formData]
  );
  return (
    <>
      <Head>
        <title>{type}文章</title>
      </Head>

      <h1>{type}文章</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label>标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={event =>
              setFormData({ ...formData, title: event.target.value })
            }
          />
        </div>

        <div>
          <label>内容</label>
          <textarea
            name="content"
            id="content"
            cols={50}
            rows={10}
            value={formData.content}
            onChange={event =>
              setFormData({ ...formData, content: event.target.value })
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

export default useCreateOrEdit;
