'use client';

import { StackClientApp } from '@stackframe/stack';

export const stackClientApp = new StackClientApp({
  tokenStore: 'nextjs-cookie',
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || '3841382e-8229-49b0-9547-3aeb2053a39f',
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || 'pck_5qrda6fqsr3m7tf868pnrhzt3jzfftq48npxjc30neg9g',
  urls: {
    handler: '/handler/stack',
  },
});
