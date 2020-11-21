import { User } from 'db/src/entity/User';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useAuth = (user: User | null): void => {
  const router = useRouter();
  useEffect(() => {
    !user?.id &&
      router.push(
        `/admin/sign-in?redirect=${encodeURIComponent(router.asPath)}`
      );
  }, [router, user?.id]);
};

export default useAuth;
