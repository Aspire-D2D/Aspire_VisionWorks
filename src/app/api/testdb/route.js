import { NextResponse } from 'next/server';
import db from '../../../lib/db'; 

export async function GET(request) {
  try {
    // Query the database
    const result = await db.query('SELECT NOW()');
    return NextResponse.json({
      message: 'Connection successful',
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { message: 'Database connection error', error: error.message },
      { status: 500 }
    );
  }
}
