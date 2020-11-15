import { NextPage } from 'next';
import useSignUpOrSignIn from 'frontend/hooks/useSignUpOrSignIn';

const SignIn: NextPage = () => {
  return useSignUpOrSignIn({
    initialFormData: { username: '', password: '' },
    url: '/api/v1/sessions',
    successRoute: '/',
    type: '登录',
  });
};

export default SignIn;
