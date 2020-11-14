import { NextApiHandler } from 'next';
import { withSession } from 'backend/withSession';
import { User } from 'db/src/entity/User';
import validateRequest from 'backend/validateRequest';

const Sessions: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated } = validateRequest(request, response, {
    method: 'POST',
  });
  if (!isMethodValidated) {
    return;
  }
  const { username, password } = request.body;
  const user = new User();
  user.username = username;
  user.password = password;
  const { hasErrors, errors, found } = await user.validateSignIn();
  if (hasErrors) {
    response.statusCode = 422;
    response.end(JSON.stringify(errors));
  } else {
    request.session.set('currentUser', found);
    await request.session.save();
    response.statusCode = 200;
    response.end(JSON.stringify(found));
  }
};

export default withSession(Sessions);
