import { NextApiHandler } from 'next';
import { withSession } from 'backend/withSession';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import validateRequest from 'backend/validateRequest';

const PostComment: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated } = validateRequest(request, response, {
    method: 'POST',
  });
  if (!isMethodValidated) return;

  const { id } = request.body;
  try {
    const { manager } = await getDatabaseConnection();
    await manager.delete('Comment', id);
    await manager.delete('Comment', { sourceCommentId: id });
    response.statusCode = 200;
    response.json({ message: '删除评论成功' });
  } catch (error) {
    response.statusCode = 500;
    response.json({ message: '服务器错误，删除评论失败' });
  }
};

export default withSession(PostComment);
