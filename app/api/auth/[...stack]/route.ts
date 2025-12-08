import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Stack Auth with nextjs-cookie tokenStore handles auth automatically via cookies
// This route just needs to exist - Stack intercepts and handles the OAuth callback
export async function GET(req: NextRequest) {
  // After OAuth, redirect to home where useUser() will see the authenticated session
  return NextResponse.redirect(new URL('/', req.url));
}

export async function POST(req: NextRequest) {
  return NextResponse.redirect(new URL('/', req.url));
}

