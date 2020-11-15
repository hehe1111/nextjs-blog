import Head from 'next/head';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import client from 'frontend/client';
import styled from 'styled-components';
import Button from 'frontend/components/Button';
import Md from 'frontend/components/Md';
import { leftEscape } from 'frontend/utils';

type IProps = {
  initialFormData: { title: string; content: string; id?: number };
  url: string;
  onSuccess: (response: AxiosResponse) => void;
  type: '新增' | '修改';
};

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.header`
  color: #777;
`;
const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const Row = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  &.flex1 {
    flex: 1;
  }
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
  flex: 1;
  display: flex;
  > * {
    width: calc(50% - 4px);
    padding: 16px 8px;
    border: 1px solid #999;
    border-radius: 8px;
    overflow: auto;
    font-size: 20px;
    line-height: 1.4;
  }
  > :nth-child(1) {
    margin-right: 4px;
  }
  > :nth-child(2) {
    margin-left: 4px;
  }
`;
const Textarea = styled.textarea`
  outline: none;
  &:hover,
  &:focus {
    border-color: #0170fe;
  }
`;
const SubmitButton = styled(Button)`
  width: 100%;
  margin: 16px 0;
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

  // 让右边预览区域的高度在不超出屏幕的前提下撑满屏幕空白区域
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const mdRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const flexPreview = () => {
      mdRef.current.style.display = 'none';
      mdRef.current.style.height = `${textAreaRef.current.offsetHeight}px`;
      mdRef.current.style.display = 'block';
    };
    flexPreview();
    window.addEventListener('resize', flexPreview);
    return () => window.removeEventListener('resize', flexPreview);
  }, []);

  // TODO: 同步滚动：暂时只实现单向同步 textarea -> md
  const onScrollTextArea = useCallback((event: UIEvent) => {
    mdRef.current.scrollTop =
      // @ts-ignore
      (event.target.scrollTop / event.target.scrollHeight) *
      mdRef.current.scrollHeight;
  }, []);
  // const onScrollMd = useCallback((event: UIEvent) => {
  //   textAreaRef.current.scrollTop =
  //     // @ts-ignore
  //     (event.target.scrollTop / event.target.scrollHeight) *
  //     textAreaRef.current.scrollHeight;
  // }, []);

  return (
    <Page>
      <Head>
        <title>{type}文章</title>
      </Head>

      <Header>{type}文章</Header>

      <Form onSubmit={onSubmit}>
        <Row>
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            type="text"
            placeholder="请输入标题"
            value={formData.title}
            onChange={event =>
              setFormData({
                ...formData,
                title: leftEscape(event.target.value),
              })
            }
          />
        </Row>

        <Row className="flex1">
          <Label htmlFor="content">内容</Label>
          <EditAndDisplay>
            <Textarea
              // @ts-ignore
              onScroll={onScrollTextArea}
              ref={textAreaRef}
              id="content"
              name="content"
              placeholder="请输入内容"
              value={formData.content}
              onChange={event =>
                setFormData({
                  ...formData,
                  content: leftEscape(event.target.value),
                })
              }
            />
            <Md string={formData.content} ref={mdRef} />
            {/* <Md string={formData.content} onScroll={onScrollMd} ref={mdRef} /> */}
          </EditAndDisplay>
        </Row>

        <SubmitButton type="submit" className="blue">
          提交
        </SubmitButton>
      </Form>
    </Page>
  );
};

export default useCreateOrEdit;
