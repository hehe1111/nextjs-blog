import { NextPage } from 'next';
import useSignUpOrSignIn from 'frontend/hooks/useSignUpOrSignIn';

const SignUp: NextPage = () => {
  return useSignUpOrSignIn({
    initialFormData: { username: '', password: '', passwordConfirmation: '' },
    url: '/api/v1/sign-up',
    successRoute: '/admin/sign-in',
    type: '注册',
  });
};

export default SignUp;
