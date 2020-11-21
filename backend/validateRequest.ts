import { Method } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type IConfig = {
  method?: Method;
  auth?: boolean;
};
type IResult = {
  isMethodValidated: boolean;
  isAuthenticated?: boolean;
};

const validateRequest = (
  request: NextApiRequest,
  response: NextApiResponse,
  config: IConfig
): IResult => {
  const result = { isMethodValidated: true, isAuthenticated: true };
  if (
    config.method &&
    request.method?.toUpperCase() !== config.method.toUpperCase()
  ) {
    response.statusCode = 405;
    response.json({ message: `请求方法只能为 ${config.method.toUpperCase()}` });
    result.isMethodValidated = false;
  }
  if (config.auth) {
    if (!request.session.get('currentUser')) {
      response.statusCode = 401;
      response.json({ message: '请先登录' });
      result.isAuthenticated = false;
    }
  }
  return result;
};

export default validateRequest;
