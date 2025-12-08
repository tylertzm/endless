import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { stackServerApp } from '@/lib/stack';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser({ tokenStore: req });
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: cardId } = await params;

    // Remove from saved cards
    await sql`
      DELETE FROM saved_cards
      WHERE user_id = ${user.id} AND card_id = ${cardId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unsaving card:', error);
    return NextResponse.json({ error: 'Failed to unsave card' }, { status: 500 });
  }
}
