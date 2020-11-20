import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { Post } from 'db/src/entity/Post';
import { Comment } from 'db/src/entity/Comment';
import Button from 'frontend/components/Button';
import _Input from 'frontend/components/Input';
import Small from 'frontend/components/Small';
import client from 'frontend/client';
import { escape, formattedDate, formattedTime } from 'frontend/utils';

type IProps = { post: Post };
type IComment = { comment: Comment; replies: Comment[] };
type IComments = { [key: number]: IComment };
interface IFormData {
  username: string;
  email: string;
  content: string;
}
interface IFormDataFull extends IFormData {
  postId: number;
  sourceCommentId?: number;
  replyTo?: string;
}

const Area = styled.div`
  @media (max-width: 700px) {
    font-size: 16px;
  }
`;
const labelWidth = '4em';
const gutter = '8px';
const rowMargin = '16px';
const Form = styled.form`
  margin-bottom: 30px;
  padding: 0 ${rowMargin} ${rowMargin} 0;
  border: 1px solid var(--grey);
  border-radius: 4px;
`;
const Label = styled.label`
  width: ${labelWidth};
  margin-right: ${gutter};
  display: inline-block;
  text-align: right;
  white-space: nowrap;
`;
const FormRow = styled.div`
  margin-top: ${rowMargin};
  display: flex;
  align-items: center;
  &.vertical-top {
    align-items: flex-start;
  }
`;
const Input = styled(_Input)`
  @media (max-width: 500px) {
    flex: 1;
  }
  @media (max-width: 320px) {
    max-width: 198px;
  }
`;
const Textarea = styled.textarea`
  flex: 1;
  padding: 16px;
  border: 1px solid var(--black);
  border-radius: 4px;
  outline: none;
  font-size: 20px;
  line-height: 1.4;
  &:hover,
  &:focus {
    border-color: var(--blue);
  }
`;
const EmptyLeft = styled.div`
  margin: ${rowMargin} 0 0 calc(${labelWidth} + ${gutter});
`;
const Tip = styled.span`
  margin-left: 8px;
  font-size: 16px;
  color: var(--red);
`;
const ReplyTo = styled.span`
  margin-top: 16px;
  padding: 4px;
  border-radius: 20px;
  display: inline-block;
  background-color: var(--blue);
  color: var(--white);
  cursor: pointer;
  &::after {
    content: '✖';
    padding: 0 4px 0 20px;
  }
`;

const CONTENT = '评论';
const USERNAME = '用户名';
const EMAIL = '邮箱';

const CommentsArea = ({ post }: IProps) => {
  const [comments, setComments] = useState(post.comments);
  const initialFormData = { username: '', email: '', content: '' };
  const [formData, setFormData] = useState<IFormData>(initialFormData);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const replyEmptyState = { sourceCommentId: -1, replyTo: '' };
  const [reply, setReply] = useState(replyEmptyState);
  const onCancelReply = useCallback(() => {
    setReply(replyEmptyState);
  }, []);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollToForm = useCallback(() => {
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);
  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      if (loading) return;

      const labels = { content: CONTENT, username: USERNAME, email: EMAIL };
      const shouldReturn = Object.keys(labels).some(k => {
        formData[k] === '' && setError(`${labels[k]}不能为空`);
        return formData[k] === '';
      });
      if (shouldReturn) return;
      error && setError('');

      const _formData = {} as IFormDataFull;
      Object.keys(formData).map(k => {
        _formData[k] = escape(formData[k].trim());
      });
      _formData.postId = post.id;
      reply.replyTo && Object.assign(_formData, reply);
      setLoading(true);
      client
        .post('/api/v1/comment/create', _formData)
        .then(() => {
          setReply(replyEmptyState);
          return client.post('/api/v1/comment/fetch', { id: post.id });
        })
        .then(response => {
          setFormData(initialFormData);
          setComments(response.data);
          alert('提交成功');
        })
        .catch((error: AxiosError) =>
          console.log(error.response.data.message, JSON.stringify(error))
        )
        .finally(() => setLoading(false));
    },
    [formData]
  );

  return (
    <Area>
      <Form onSubmit={onSubmit} ref={formRef}>
        <FormRow className="vertical-top">
          <Label htmlFor="content">{CONTENT}</Label>
          <Textarea
            id="content"
            rows={10}
            value={formData.content}
            onChange={event =>
              setFormData({ ...formData, content: event.target.value })
            }
          />
        </FormRow>
        {[
          ['username', USERNAME, 'text'],
          ['email', EMAIL, 'email'],
        ].map(f => (
          <FormRow key={f[0]}>
            <Label htmlFor={f[0]}>{f[1]}</Label>
            <Input
              id={f[0]}
              type={f[2]}
              value={formData[f[0]]}
              onChange={event =>
                setFormData({ ...formData, [f[0]]: event.target.value })
              }
            />
          </FormRow>
        ))}
        <EmptyLeft>* {EMAIL}不会被公开</EmptyLeft>

        <EmptyLeft>
          <Button className="blue">提交</Button>
          {error && <Tip>{error}</Tip>}
          {loading && <Tip>加载中...</Tip>}
          {reply.replyTo && (
            <div>
              <ReplyTo onClick={onCancelReply}>@{reply.replyTo}</ReplyTo>
            </div>
          )}
        </EmptyLeft>
      </Form>

      <CommentsDisplay
        comments={comments}
        setReply={setReply}
        scrollToForm={scrollToForm}
      />
    </Area>
  );
};

export default CommentsArea;

const CommentRow = styled.div`
  padding-top: 30px;
  word-break: break-all;
`;
export const Name = styled.span`
  color: var(--red);
`;
const Replies = styled.div`
  padding-left: 2em;
`;
function CommentsDisplay({ comments, setReply, scrollToForm }) {
  const formatComments: IComments = {};
  comments.sort((a: Comment, b: Comment) => a.id - b.id);
  comments.map((c: Comment) => {
    if (c.replyTo) {
      formatComments[c.sourceCommentId].replies.push(c);
    } else {
      formatComments[c.id] = { comment: c, replies: [] };
    }
  });
  return (
    <>
      <div>评论（{comments.length}）</div>
      {Object.keys(formatComments).map(id => {
        const { comment, replies } = formatComments[id] as IComment;
        return (
          <CommentRow key={id}>
            <Name>{comment.username}</Name>
            <span>：</span>
            <ContentRow
              comment={comment}
              setReply={setReply}
              scrollToForm={scrollToForm}
            />

            <Replies>
              {replies.map(r => (
                <CommentRow key={r.id}>
                  <Name>{r.username}</Name>
                  <span> 回复 </span>
                  <Name>{r.replyTo}</Name>
                  <span>：</span>
                  <ContentRow
                    comment={r}
                    setReply={setReply}
                    scrollToForm={scrollToForm}
                  />
                </CommentRow>
              ))}
            </Replies>
          </CommentRow>
        );
      })}
    </>
  );
}

const ContentRowElement = styled.div`
  padding-top: 8px;
  padding-bottom: 4px;
  border-bottom: 1px dashed var(--grey);
  position: relative;
`;
const Content = styled.p`
  padding-right: 40px;
`;
const Time = styled(Small)`
  margin-top: 10px;
  text-align: right;
  white-space: nowrap;
`;
const Reply = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 16px;
  &:hover {
    color: var(--blue);
  }
`;
function ContentRow({ comment, setReply, scrollToForm }) {
  const { content, createdAt, sourceCommentId, id, username } = comment;
  const onReply = useCallback(() => {
    scrollToForm();
    setReply({
      sourceCommentId: sourceCommentId || id,
      replyTo: username,
    });
  }, []);
  return (
    <ContentRowElement>
      <Content>{content}</Content>
      <Time>
        {formattedDate(createdAt)} {formattedTime(createdAt)}
      </Time>
      <Reply className="reply" onClick={onReply}>
        回复
      </Reply>
    </ContentRowElement>
  );
}
