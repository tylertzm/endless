import { NextRequest, NextResponse } from 'next/server';
import sql from '../../../../lib/db';
import { stackServerApp } from '../../../../lib/stack';

// Force Node.js runtime for proper Neon TCP connection
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cardId } = await params;

    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const result = await sql`
      SELECT id, name, title, company, phone, email, website, address, socials, image_data, style, created_at
      FROM cards
      WHERE id = ${cardId}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const card = result[0];

    // Parse socials JSON if it exists
    let socials = [];
    try {
      socials = card.socials ? JSON.parse(card.socials) : [];
    } catch (e) {
      console.error('Failed to parse socials:', e);
      socials = [];
    }

    return NextResponse.json({
      id: card.id,
      name: card.name,
      title: card.title,
      company: card.company,
      phone: card.phone,
      email: card.email,
      website: card.website,
      address: card.address,
      socials: socials,
      imageData: card.image_data,
      style: card.style,
      createdAt: card.created_at
    });
  } catch (error) {
    console.error('Get card error:', error);
    return NextResponse.json({ error: 'Failed to get card' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser({ tokenStore: req });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: cardId } = await params;

    // Verify the card belongs to the user
    const result = await sql`
      SELECT user_id FROM cards
      WHERE id = ${cardId}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const card = result[0];

    // Get the user id from our users table
    const userResult = await sql`
      SELECT id FROM users WHERE stack_auth_id = ${user.id}
    `;

    if (userResult.length === 0 || card.user_id !== userResult[0].id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the card
    await sql`DELETE FROM cards WHERE id = ${cardId}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser({ tokenStore: request });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: cardId } = await params;
    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, title, company, phone, email, website, address, socials, style, imageData } = body;

    // Verify the card belongs to the user
    const userResult = await sql`
      SELECT id FROM users WHERE stack_auth_id = ${user.id}
    `;

    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const internalUserId = userResult[0].id;

    const cardCheck = await sql`
      SELECT id FROM cards WHERE id = ${cardId} AND user_id = ${internalUserId}
    `;

    if (cardCheck.length === 0) {
      return NextResponse.json({ error: 'Card not found or access denied' }, { status: 404 });
    }

    // Update the card
    await sql`
      UPDATE cards SET
        name = ${name},
        title = ${title || null},
        company = ${company || null},
        phone = ${phone || null},
        email = ${email || null},
        website = ${website || null},
        address = ${address || null},
        socials = ${JSON.stringify(socials || [])},
        image_data = ${imageData || null},
        style = ${style || 'kosma'},
        updated_at = NOW()
      WHERE id = ${cardId}
    `;

    return NextResponse.json({ id: cardId });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}