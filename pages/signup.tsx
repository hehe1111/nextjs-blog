import { NextPage } from 'next';
import useSignUpOrSignIn from 'frontend/hooks/useSignUpOrSignIn';

const SignUp: NextPage = () => {
  return useSignUpOrSignIn({
    initialFormData: { username: '', password: '', passwordConfirmation: '' },
    url: '/api/v1/user',
    successRoute: '/signin',
    type: '注册',
  });
};

export default SignUp;
