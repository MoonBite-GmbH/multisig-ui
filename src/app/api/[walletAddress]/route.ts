import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(req: NextRequest, { params }: { params: { walletAddress: string } }) {
  const walletAddress = params.walletAddress;

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet Address is required' }, { status: 400 });
  }

  console.log(walletAddress)

  try {
    const result = await sql`
      SELECT * FROM multisigs
      WHERE ${walletAddress} = ANY(members);
    `;
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
