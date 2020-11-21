import { withIronSession } from 'next-iron-session';
import { GetServerSideProps, NextApiHandler } from 'next';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function withSession(handler: NextApiHandler | GetServerSideProps) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'nextjs-blog',
    cookieOptions: { secure: false },
  });
}
