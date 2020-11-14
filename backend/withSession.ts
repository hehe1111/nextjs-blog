import { withIronSession } from 'next-iron-session';
import { NextApiHandler } from 'next';

export function withSession(handler: NextApiHandler) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'nextjs-blog',
    cookieOptions: { secure: false },
  });
}
