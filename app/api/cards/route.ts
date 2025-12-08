import { NextRequest, NextResponse } from 'next/server';
import sql from '../../../lib/db';
import { stackServerApp } from '../../../lib/stack';
import { createId } from '@paralleldrive/cuid2';

// Force Node.js runtime for proper Neon TCP connection
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('API: Starting card save request');

    const user = await stackServerApp.getUser({ tokenStore: request });
    console.log('API: User from Stack:', user);

    if (!user) {
      console.log('API: No user found, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('API: Request body:', body);

    const { name, title, company, phone, email, website, address, socials, style } = body;

    // Generate IDs for user and card
    const userId = createId();
    const cardId = createId();
    const now = new Date();

    console.log('API: Generated IDs - userId:', userId, 'cardId:', cardId);

    // First, ensure user exists in our users table
    console.log('API: Inserting/updating user in database');
    await sql`
      INSERT INTO users (id, stack_auth_id, email, created_at, updated_at)
      VALUES (${userId}, ${user.id}, ${user.primaryEmail || ''}, ${now}, ${now})
      ON CONFLICT (stack_auth_id) DO UPDATE SET id = EXCLUDED.id
    `;

    // Get the user id from the insert
    console.log('API: Getting user ID from database');
    const userResult = await sql`
      SELECT id FROM users WHERE stack_auth_id = ${user.id}
    `;
    const finalUserId = userResult[0].id;
    console.log('API: Final user ID:', finalUserId);

    // Insert the card
    const imageData = body.imageData || null;
    console.log('API: Inserting card with data:', { name, title, company, phone, email, website, address, socials, imageData, style });

    const result = await sql`
      INSERT INTO cards (id, user_id, name, title, company, phone, email, website, address, socials, image_data, style, created_at, updated_at)
      VALUES (
        ${cardId},
        ${finalUserId},
        ${name}, ${title || null}, ${company || null}, ${phone || null}, ${email || null}, ${website || null}, ${address || null}, ${JSON.stringify(socials || [])}, ${imageData}, ${style || 'kosma'}, ${now}, ${now}
      )
      RETURNING id
    `;

    const returnedCardId = result[0].id;
    console.log('API: Card saved successfully with ID:', returnedCardId);

    return NextResponse.json({ id: returnedCardId });
  } catch (error) {
    console.error('Save card error:', error);
    return NextResponse.json({ error: 'Failed to save card' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser({ tokenStore: request });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cards = await sql`
      SELECT id, name, title, company, phone, email, website, address, socials, style, created_at
      FROM cards
      WHERE user_id = (SELECT id FROM users WHERE stack_auth_id = ${user.id})
      ORDER BY created_at DESC
    `;

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Get cards error:', error);
    return NextResponse.json({ error: 'Failed to get cards' }, { status: 500 });
  }
}