// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="next" />
/// <reference types="next/types/global" />
// https://github.com/twopluszero/next-images#typescript
/// <reference types="next-images" />
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as next from 'next';
import { Session } from 'next-iron-session';

declare module 'next' {
  interface NextApiRequest {
    session: Session;
  }
}
