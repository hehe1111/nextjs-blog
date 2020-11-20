import { NextApiHandler } from 'next';
import { Post } from 'db/src/entity/Post';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import validateRequest from 'backend/validateRequest';

const CommentCount: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated } = validateRequest(request, response, {
    method: 'POST',
  });
  if (!isMethodValidated) return;

  const { id, pageView } = request.body;
  try {
    const { manager } = await getDatabaseConnection();
    const post = await manager.findOne<Post>('Post', id);
    post.pageView = pageView;
    await manager.save(post);
    response.statusCode = 200;
    response.json(post);
  } catch (error) {
    response.statusCode = 500;
    response.json({ message: '服务器错误，统计文章阅读数失败' });
  }
};

export default CommentCount;
