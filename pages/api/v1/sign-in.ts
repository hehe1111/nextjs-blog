import { NextApiHandler } from 'next';
import md5 from 'md5';
import { User } from 'db/src/entity/User';
import { withSession } from 'backend/withSession';
import validateRequest from 'backend/validateRequest';
import getDatabaseConnection from 'backend/getDatabaseConnection';

const SignIn: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated } = validateRequest(request, response, {
    method: 'POST',
  });
  if (!isMethodValidated) return;

  const { username, password } = request.body;
  const { hasErrors, errors, found } = await validateSignIn({
    username,
    password,
  });
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

export default withSession(SignIn);

async function validateSignIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const errors = { username: [] as string[], password: [] as string[] };
  username.trim() === '' && errors.username.push('请填写用户名');
  password.trim() === '' && errors.password.push('请填写密码');
  const found = await (await getDatabaseConnection()).manager.findOne<User>(
    'User',
    { where: { username } }
  );
  if (found) {
    if (found.passwordDigest !== md5(password)) {
      errors.password.push('密码与用户名不匹配');
    }
  } else {
    username.trim() !== '' && errors.username.push('用户不存在');
  }

  return {
    hasErrors: !!Object.values(errors).find(v => v.length > 0),
    errors,
    found,
  };
}
