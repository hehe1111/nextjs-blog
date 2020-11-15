import { withIronSession } from 'next-iron-session';
import { GetServerSideProps, NextApiHandler } from 'next';

export function withSession(handler: NextApiHandler | GetServerSideProps) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'nextjs-blog',
    cookieOptions: { secure: false },
  });
}
