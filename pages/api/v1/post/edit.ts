import { NextApiHandler } from 'next';
import { Post } from 'db/src/entity/Post';
import { withSession } from 'backend/withSession';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import validateRequest from 'backend/validateRequest';

const PostEdit: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated, isAuthenticated } = validateRequest(
    request,
    response,
    { method: 'POST', auth: true }
  );
  if (!isMethodValidated || !isAuthenticated) return;

  const { title, content, id } = request.body;
  try {
    const { manager } = await getDatabaseConnection();
    const post = await manager.findOne<Post>('Post', id);
    post.title = title;
    post.content = content;
    await manager.save(post);
    response.statusCode = 200;
    response.json(post);
  } catch (error) {
    response.statusCode = 500;
    response.json({ message: '服务器错误，修改文章失败' });
  }
};

export default withSession(PostEdit);
