import { StackServerApp } from '@stackframe/stack';

if (!process.env.STACK_SECRET_SERVER_KEY) {
  throw new Error('STACK_SECRET_SERVER_KEY is not set');
}

export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
  urls: {
    handler: '/handler/stack',
  },
});