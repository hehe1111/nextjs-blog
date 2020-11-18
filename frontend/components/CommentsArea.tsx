import styled from 'styled-components';
import { useCallback, useState } from 'react';
import { Post } from 'db/src/entity/Post';
import { Comment } from 'db/src/entity/Comment';
import Button from 'frontend/components/Button';
import { default as _Input } from 'frontend/components/Input';
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

const labelWidth = '4em';
const gutter = '8px';
const rowMargin = '16px';
const Form = styled.form`
  margin: 100px 0 20px 0;
  padding: 0 ${rowMargin} ${rowMargin} 0;
  border: 1px solid #ddd;
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
  &.x {
    align-items: flex-start;
  }
`;
const Input = styled(_Input)`
  @media (max-width: 500px) {
    max-width: 220px;
  }
  @media (max-width: 320px) {
    max-width: 166px;
  }
`;
const Textarea = styled.textarea`
  flex: 1;
  padding: 16px;
  border: 1px solid #999;
  border-radius: 4px;
  outline: none;
  font-size: 20px;
  line-height: 1.4;
  &:hover,
  &:focus {
    border-color: #0170fe;
  }
`;
const Submit = styled.div`
  margin: ${rowMargin} 0 0 calc(${labelWidth} + ${gutter});
`;
const ErrorTip = styled.span`
  margin-left: 8px;
  font-size: 16px;
  color: #f00;
`;
const rowPadding = '30px';
const CommentRow = styled.div`
  padding-top: ${rowPadding};
  word-break: break-all;
`;
const CommentUsernameAndTime = styled.div`
  display: flex;
  align-items: center;
`;
const CommentUsername = styled.span`
  color: #f00;
`;
const CommentTime = styled.time`
  flex: 1;
  color: #ccc;
  text-align: right;
  white-space: nowrap;
`;
const CommentContent = styled.div`
  padding-top: 10px;
  padding-bottom: ${rowPadding};
  border-bottom: 1px dashed #ddd;
`;
const CommentReplies = styled.div`
  padding-left: 2em;
`;

const CommentsArea = ({ post }: IProps) => {
  const [comments, setComments] = useState(post.comments);
  const _comments: IComments = {};
  comments.map(c => {
    if (c.replyTo) {
      _comments[c.sourceCommentId].replies.push(c);
    } else {
      _comments[c.id] = { comment: c, replies: [] };
    }
  });

  const initialFormData = {
    username: '',
    email: '',
    content: '',
  };
  const [formData, setFormData] = useState<IFormData>(initialFormData);
  const [error, setError] = useState('');
  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      if (formData.username === '') {
        return setError('用户名不能为空');
      }
      if (formData.email === '') {
        return setError('邮箱不能为空');
      }
      if (formData.content === '') {
        return setError('内容不能为空');
      }
      error && setError('');
      const _formData = {} as IFormDataFull;
      Object.keys(formData).map(k => {
        _formData[k] = escape(formData[k].trim());
      });
      _formData.postId = post.id;
      client
        .post('/api/v1/comment/create', _formData)
        .then(() => {
          return client.post('/api/v1/comment/fetch', { id: post.id });
        })
        .then(response => {
          setFormData(initialFormData);
          setComments(response.data);
        })
        .catch(error => console.log(error));
    },
    [formData]
  );

  return (
    <>
      <Form onSubmit={onSubmit}>
        <FormRow>
          <Label htmlFor="username">用户名</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={event =>
              setFormData({ ...formData, username: event.target.value })
            }
          />
        </FormRow>
        <FormRow>
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={event =>
              setFormData({ ...formData, email: event.target.value })
            }
          />
        </FormRow>
        <FormRow className="x">
          <Label htmlFor="content">内容</Label>
          <Textarea
            id="content"
            rows={10}
            value={formData.content}
            onChange={event =>
              setFormData({ ...formData, content: event.target.value })
            }
          />
        </FormRow>
        <Submit>
          <Button className="blue">提交</Button>
          {error && <ErrorTip>{error}</ErrorTip>}
        </Submit>
      </Form>

      {!comments.length ? (
        <>暂无评论~</>
      ) : (
        Object.keys(_comments).map(id => {
          const {
            comment: { username, content, createdAt },
            replies,
          } = _comments[id] as IComment;
          return (
            <CommentRow key={id}>
              <CommentUsernameAndTime>
                <CommentUsername>{username}</CommentUsername>
                <CommentTime>
                  {formattedDate(createdAt)}{' '}
                  {formattedTime({ time: createdAt })}
                </CommentTime>
              </CommentUsernameAndTime>
              <CommentContent>{content}</CommentContent>
              <CommentReplies>
                {replies.map(r => (
                  <CommentRow key={r.id}>
                    <CommentUsernameAndTime>
                      <CommentUsername>{r.username}</CommentUsername>
                      <span> 回复 </span>
                      <CommentUsername>{r.replyTo}</CommentUsername>
                      <CommentTime>
                        {formattedDate(r.createdAt)}{' '}
                        {formattedTime({ time: r.createdAt })}
                      </CommentTime>
                    </CommentUsernameAndTime>
                    <CommentContent>{r.content}</CommentContent>
                  </CommentRow>
                ))}
              </CommentReplies>
            </CommentRow>
          );
        })
      )}
    </>
  );
};

export default CommentsArea;
