/**
 * ! 管理员账号通过直接修改数据库存入，只保留登录页，注册页注释掉，改为跳转到登录页面
 */

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
// import useSignUpOrSignIn from 'frontend/hooks/useSignUpOrSignIn';

const SignUp: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/sign-in');
  }, [router]);
  return <>暂时不能注册，正在前往登录页...</>;

  // return useSignUpOrSignIn({
  //   initialFormData: { username: '', password: '', passwordConfirmation: '' },
  //   url: '/api/v1/sign-up',
  //   successRoute: '/admin/sign-in',
  //   type: '注册',
  // });
};

export default SignUp;
