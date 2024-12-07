import bcrypt from 'bcryptjs';
import { query } from '../../../lib/db';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), {
        status: 400,
      });
    }

    const userCheck = await query('SELECT * FROM UserDetails WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return new Response(JSON.stringify({ message: 'User with this email already exists' }), {
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      'INSERT INTO UserDetails (username, email, password, role) VALUES ($1, $2, $3, $4)',
      [username, email, hashedPassword, 'admin']
    );

    return new Response(JSON.stringify({ message: 'Admin registered successfully' }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
  }
}

