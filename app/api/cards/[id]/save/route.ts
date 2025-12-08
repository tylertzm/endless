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

    // Check if already saved
    const [existing] = await sql`
      SELECT id FROM saved_cards
      WHERE user_id = ${user.id} AND card_id = ${cardId}
    `;

    if (existing) {
      return NextResponse.json({ error: 'Card already saved' }, { status: 400 });
    }

    // Save the card
    await sql`
      INSERT INTO saved_cards (user_id, card_id)
      VALUES (${user.id}, ${cardId})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving card:', error);
    return NextResponse.json({ error: 'Failed to save card' }, { status: 500 });
  }
}
