import { NextApiHandler } from 'next';
import { withSession } from 'lib/withSession';
import getDatabaseConnection from 'lib/getDatabaseConnection';
import validateRequest from 'lib/validateRequest';

const PostDelete: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated, isAuthenticated } = validateRequest(
    request,
    response,
    { method: 'POST', auth: true }
  );
  if (!isMethodValidated || !isAuthenticated) {
    return;
  }
  const { id } = request.body;
  const connection = await getDatabaseConnection();
  await connection.manager.delete('Post', id);
  response.statusCode = 200;
  response.json({ message: '删除成功' });
};

export default withSession(PostDelete);
