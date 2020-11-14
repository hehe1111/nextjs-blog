import Head from 'next/head';
import { FormEvent, useCallback, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import client from 'frontend/client';
import styled from 'styled-components';
import Button from 'frontend/components/Button';
import Md from 'frontend/components/Md';

type IProps = {
  initialFormData: { title: string; content: string; id?: number };
  url: string;
  onSuccess: (response: AxiosResponse) => void;
  type: '新增' | '修改';
};

const Header = styled.header`
  color: #777;
`;
const Row = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;
const Label = styled.label`
  margin-bottom: 0.5em;
  font-size: 16px;
  color: #999;
`;
const Input = styled.input`
  padding-left: 16px;
  padding-right: 16px;
  border: 1px solid #999;
  border-radius: 24px;
  font-size: 24px;
  line-height: 2;
  outline: none;
  &:hover,
  &:focus {
    border-color: #0170fe;
  }
`;
const EditAndDisplay = styled.div`
  height: 300px;
  display: flex;
  > * {
    width: calc(50% - 4px);
    height: 100%;
    padding: 8px;
    border: 1px solid #999;
    border-radius: 8px;
    overflow: auto;
  }
  > :nth-child(1) {
    margin-right: 4px;
  }
  > :nth-child(2) {
    margin-left: 4px;
  }
`;
const Textarea = styled.textarea`
  font-size: 20px;
  line-height: 1.4;
  outline: none;
  &:hover,
  &:focus {
    border-color: #0170fe;
  }
`;
const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
`;

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
      });
    },
    [formData]
  );
  return (
    <>
      <Head>
        <title>{type}文章</title>
      </Head>

      <Header>{type}文章</Header>

      <form onSubmit={onSubmit}>
        <Row>
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            type="text"
            placeholder="请输入标题"
            value={formData.title}
            onChange={event =>
              setFormData({ ...formData, title: event.target.value })
            }
          />
        </Row>

        <Row>
          <Label htmlFor="content">内容</Label>
          <EditAndDisplay>
            <Textarea
              id="content"
              name="content"
              placeholder="请输入内容"
              value={formData.content}
              onChange={event =>
                setFormData({ ...formData, content: event.target.value })
              }
            />
            <Md string={formData.content} />
          </EditAndDisplay>
        </Row>
        <div>
          <SubmitButton type="submit" className="blue">
            提交
          </SubmitButton>
        </div>
      </form>
    </>
  );
};

export default useCreateOrEdit;
