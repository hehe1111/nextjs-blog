import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
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

const Area = styled.div`
  @media (max-width: 700px) {
    font-size: 16px;
  }
`;
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
const Tip = styled.span`
  margin-left: 8px;
  font-size: 16px;
  color: #f00;
`;
const ReplyTo = styled.div`
  margin-top: 16px;
  cursor: pointer;
  &::after {
    content: '✖';
    padding-left: 16px;
  }
`;

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

      const labels = { username: '用户名', email: '邮箱', content: '内容' };
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
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    },
    [formData]
  );

  return (
    <Area>
      <Form onSubmit={onSubmit} ref={formRef}>
        {[
          ['username', '用户名'],
          ['email', '邮箱'],
        ].map(f => (
          <FormRow key={f[0]}>
            <Label htmlFor={f[0]}>{f[1]}</Label>
            <Input
              id={f[0]}
              type="text"
              value={formData[f[0]]}
              onChange={event =>
                setFormData({ ...formData, [f[0]]: event.target.value })
              }
            />
          </FormRow>
        ))}
        <FormRow className="vertical-top">
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
          {error && <Tip>{error}</Tip>}
          {loading && <Tip>加载中...</Tip>}
          {reply.replyTo && (
            <ReplyTo onClick={onCancelReply}>@{reply.replyTo}</ReplyTo>
          )}
        </Submit>
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

const rowPadding = '30px';
const CommentRow = styled.div`
  padding-top: ${rowPadding};
  word-break: break-all;
`;
export const Name = styled.span`
  color: #f00;
`;
const Replies = styled.div`
  padding-left: 2em;
`;
function CommentsDisplay({ comments, setReply, scrollToForm }) {
  const formatComments: IComments = {};
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
  padding-bottom: ${rowPadding};
  border-bottom: 1px dashed #ddd;
  position: relative;
`;
const Content = styled.p`
  padding-right: 40px;
`;
const Time = styled.time`
  margin-top: 10px;
  display: block;
  font-size: 16px;
  color: #ccc;
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
    color: #0170fe;
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
