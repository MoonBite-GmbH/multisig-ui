import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if(process.env.NODE_ENV === "production") return NextResponse.json({}, {status: 404})

  try {
    await sql`DROP TABLE IF EXISTS multisigs;`;
    const result = await sql`
      CREATE TABLE multisigs (
        id VARCHAR PRIMARY KEY,
        members TEXT[]
      );
    `;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
