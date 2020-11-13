import { NextApiHandler } from 'next';
import { Post } from 'src/entity/Post';
import { withSession } from 'lib/withSession';
import getDatabaseConnection from 'lib/getDatabaseConnection';
import validateRequest from 'lib/validateRequest';

const PostEdit: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated, isAuthenticated } = validateRequest(
    request,
    response,
    { method: 'POST', auth: true }
  );
  if (!isMethodValidated || !isAuthenticated) {
    return;
  }
  const { title, content, id } = request.body;
  try {
    const connection = await getDatabaseConnection();
    const post = await connection.manager.findOne<Post>('Post', id);
    post.title = title;
    post.content = content;
    await connection.manager.save(post);
    response.statusCode = 200;
    response.json(post);
  } catch (error) {
    response.statusCode = 500;
    response.json({ message: '服务器错误，修改文章失败' });
  }
};

export default withSession(PostEdit);
