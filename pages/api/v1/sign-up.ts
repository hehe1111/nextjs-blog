import { NextApiHandler } from 'next';
import { User } from 'db/src/entity/User';
import validateRequest from 'backend/validateRequest';
import getDatabaseConnection from 'backend/getDatabaseConnection';

const SignUp: NextApiHandler = async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { isMethodValidated } = validateRequest(request, response, {
    method: 'POST',
  });
  if (!isMethodValidated) return;

  const { username, password, passwordConfirmation } = request.body;
  const { hasErrors, errors } = await validateSignUp({
    username,
    password,
    passwordConfirmation,
  });
  if (hasErrors) {
    response.statusCode = 422;
    response.write(JSON.stringify(errors));
  } else {
    const user = new User();
    user.username = username.trim();
    user.password = password.trim();
    await (await getDatabaseConnection()).manager.save(user);
    response.statusCode = 200;
    response.write(JSON.stringify(user));
  }
  response.end();
};

export default SignUp;

async function validateSignUp({
  username,
  password,
  passwordConfirmation,
}: {
  username: string;
  password: string;
  passwordConfirmation: string;
}) {
  const errors = {
    username: [] as string[],
    password: [] as string[],
    passwordConfirmation: [] as string[],
  };
  const _name = username.trim();
  _name === '' && errors.username.push('用户名不能为空');
  !/[0-9A-Za-z]+/g.test(_name) &&
    errors.username.push('用户名只能由大小写字母或数字组成');
  _name.length < 3 && errors.username.push('用户名不能少于 3 位');
  _name.length > 16 && errors.username.push('用户名不能多于 16 位');
  const found = await (await getDatabaseConnection()).manager.findOne('User', {
    where: { username: username },
  });
  found && errors.username.push('用户名已被占用');
  password.length === 0 && errors.password.push('密码不能为空');
  password !== passwordConfirmation &&
    errors.passwordConfirmation.push('密码与确认密码不一致');

  return {
    hasErrors: !!Object.values(errors).find(v => v.length > 0),
    errors,
  };
}
