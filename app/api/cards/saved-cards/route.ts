import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { stackServerApp } from '@/lib/stack';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser({ tokenStore: req });
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the internal user ID from our users table
    const userResult = await sql`
      SELECT id FROM users WHERE stack_auth_id = ${user.id}
    `;

    if (userResult.length === 0) {
      return NextResponse.json({ cards: [] });
    }

    const internalUserId = userResult[0].id;

    const cards = await sql`
      SELECT c.* FROM cards c
      INNER JOIN saved_cards sc ON c.id = sc.card_id
      WHERE sc.user_id = ${internalUserId}
      ORDER BY sc.saved_at DESC
    `;

    return NextResponse.json({ cards });
  } catch (error) {
    console.error('Error fetching saved cards:', error);
    return NextResponse.json({ error: 'Failed to fetch saved cards' }, { status: 500 });
  }
}
