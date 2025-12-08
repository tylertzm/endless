'use client';

import { StackHandler } from '@stackframe/stack';
import { stackClientApp } from '@/lib/stack-client';

export default function Handler() {
  return <StackHandler app={stackClientApp} fullPage />;
}
