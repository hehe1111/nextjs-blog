import { NextApiHandler } from 'next';
import { Post } from 'db/src/entity/Post';
import { withSession } from 'backend/withSession';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import validateRequest from 'backend/validateRequest';

const PostCreate: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated, isAuthenticated } = validateRequest(
    request,
    response,
    { method: 'POST', auth: true }
  );
  if (!isMethodValidated || !isAuthenticated) return;

  const { title, content } = request.body;
  const post = new Post();
  post.title = title;
  post.content = content;
  const user = request.session.get('currentUser');
  post.author = user;
  try {
    const { manager } = await getDatabaseConnection();
    await manager.save(post);
    response.statusCode = 200;
    response.json(post);
  } catch (error) {
    response.statusCode = 500;
    response.json({ message: '服务器错误，新增文章失败' });
  }
};

export default withSession(PostCreate);
