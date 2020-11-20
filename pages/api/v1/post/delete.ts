import { NextApiHandler } from 'next';
import { withSession } from 'backend/withSession';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import validateRequest from 'backend/validateRequest';

const PostDelete: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated, isAuthenticated } = validateRequest(
    request,
    response,
    { method: 'DELETE', auth: true }
  );
  if (!isMethodValidated || !isAuthenticated) return;

  try {
    const { manager } = await getDatabaseConnection();
    await manager.delete('Post', request.body.id);
    response.statusCode = 200;
    response.json({ message: '删除文章成功' });
  } catch (error) {
    response.statusCode = 500;
    response.json({ message: '服务器错误，删除文章失败' });
  }
};

export default withSession(PostDelete);
