import { NextApiHandler } from 'next';
import getDatabaseConnection from 'backend/getDatabaseConnection';
import validateRequest from 'backend/validateRequest';
import { User } from 'db/src/entity/User';

const UserApi: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated } = validateRequest(request, response, {
    method: 'POST',
  });
  if (!isMethodValidated) {
    return;
  }
  const { username, password, passwordConfirmation } = request.body;
  const connection = await getDatabaseConnection();
  const user = new User();
  user.username = username.trim();
  user.password = password.trim();
  user.passwordConfirmation = passwordConfirmation.trim();
  const { hasErrors, errors } = await user.validateSignUp();
  if (hasErrors) {
    response.statusCode = 422;
    response.write(JSON.stringify(errors));
  } else {
    await connection.manager.save(user);
    response.statusCode = 200;
    response.write(JSON.stringify(user));
  }
  response.end();
};

export default UserApi;
