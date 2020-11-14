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
  if (!isMethodValidated || !isAuthenticated) {
    return;
  }
  const { title, content } = request.body;
  const post = new Post();
  post.title = title;
  post.content = content;
  const user = request.session.get('currentUser');
  post.author = user;
  const connection = await getDatabaseConnection();
  await connection.manager.save(post);
  response.statusCode = 200;
  response.json(post);
};

export default withSession(PostCreate);
