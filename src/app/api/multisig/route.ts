import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { multisigId, members } = await req.json();

    if (!multisigId || !Array.isArray(members)) {
      return NextResponse.json({ error: 'Multisig ID and members are required' }, { status: 400 });
    }

    const parsedMembers = `{${members.join(',')}}`;

    const result = await sql`
      INSERT INTO multisigs (id, members)
      VALUES (${multisigId}, ${parsedMembers})
      ON CONFLICT (id)
      DO UPDATE SET members = ${parsedMembers}
    `;

    return NextResponse.json({ message: 'Multisig created or updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
