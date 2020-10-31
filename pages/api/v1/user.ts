import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { NextApiHandler } from 'next';
import { User } from 'src/entity/User';

const UserApi: NextApiHandler = async (request, response) => {
  const { username, password, passwordConfirmation } = request.body;
  const connection = await getDatabaseConnection();
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const user = new User();
  user.username = username.trim();
  user.password = password.trim();
  user.passwordConfirmation = passwordConfirmation.trim();
  await user.validate();
  if (user.hasErrors()) {
    response.statusCode = 422;
    response.write(JSON.stringify(user.errors));
  } else {
    await connection.manager.save(user);
    response.statusCode = 200;
    response.write(JSON.stringify(user));
  }
  response.end();
};

export default UserApi;
