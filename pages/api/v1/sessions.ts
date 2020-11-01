import { NextApiHandler } from 'next';
import { withSession } from 'lib/withSession';
import { User } from 'src/entity/User';

const Sessions: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const METHOD = 'POST';
  if (request.method?.toUpperCase() !== METHOD) {
    response.statusCode = 405;
    return response.end(`{message: "请求方法只能为 ${METHOD}"}`);
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
