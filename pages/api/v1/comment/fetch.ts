import { NextApiHandler } from 'next';
import { Post } from 'db/src/entity/Post';
import { withSession } from 'backend/withSession';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import validateRequest from 'backend/validateRequest';

const PostComment: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated } = validateRequest(request, response, {
    method: 'POST',
  });
  if (!isMethodValidated) {
    return;
  }
  const { id } = request.body;
  const { manager } = await getDatabaseConnection();
  const post = await manager.findOne<Post>('Post', {
    where: { id },
    relations: ['comments'],
  });
  response.statusCode = 200;
  response.json(post.comments);
};

export default withSession(PostComment);
