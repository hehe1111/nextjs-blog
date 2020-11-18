import { NextApiHandler } from 'next';
import { withSession } from 'backend/withSession';
import validateRequest from 'backend/validateRequest';

const SignOut: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated, isAuthenticated } = validateRequest(
    request,
    response,
    {
      method: 'POST',
      auth: true,
    }
  );
  if (!isMethodValidated || !isAuthenticated) {
    return;
  }
  request.session.destroy();
  response.statusCode = 200;
  response.json({ message: '退出成功' });
};

export default withSession(SignOut);
