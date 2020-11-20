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
  if (!isMethodValidated) return;

  try {
    const { manager } = await getDatabaseConnection();
    const post = await manager.findOne<Post>('Post', {
      where: { id: request.body.id },
      relations: ['comments'],
    });
    response.statusCode = 200;
    response.json(post.comments);
  } catch (error) {
    response.statusCode = 500;
    response.json({ messge: '服务器错误，获取评论失败' });
  }
};

export default withSession(PostComment);
