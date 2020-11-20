import { NextApiHandler } from 'next';
import { Post } from 'db/src/entity/Post';
import { Comment } from 'db/src/entity/Comment';
import { withSession } from 'backend/withSession';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import validateRequest from 'backend/validateRequest';

const CommentCreate: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated } = validateRequest(request, response, {
    method: 'POST',
  });
  if (!isMethodValidated) return;

  const {
    postId,
    username,
    email,
    content,
    sourceCommentId,
    replyTo,
  } = request.body;
  try {
    const { manager } = await getDatabaseConnection();
    const post = await manager.findOne<Post>('Post', postId);
    const comment = new Comment();
    comment.post = post;
    comment.username = username;
    comment.email = email;
    comment.content = content;
    sourceCommentId && (comment.sourceCommentId = sourceCommentId);
    replyTo && (comment.replyTo = replyTo);
    await manager.save(comment);
    response.statusCode = 200;
    response.json(comment);
  } catch (error) {
    response.statusCode = 500;
    response.json({ message: '服务器错误，评论失败' });
  }
};

export default withSession(CommentCreate);
