import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import bcrypt from 'bcryptjs'; 

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const insertResult = await db.query(
      `INSERT INTO userDetails (username, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role`,
      ['admin', 'admin@nomail.com', hashedPassword, 'admin']
    );

    const result = await db.query('SELECT NOW()');

    return NextResponse.json({
      message: 'Connection successful and admin user inserted with hashed password',
      time: result.rows[0].now,
      user: insertResult.rows[0],
    });
  } catch (error) {
    console.error('Database connection or insertion error:', error);
    return NextResponse.json(
      { message: 'Database connection or insertion error', error: error.message },
      { status: 500 }
    );
  }
}
