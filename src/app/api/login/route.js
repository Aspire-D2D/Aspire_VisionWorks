import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'ec3bfab24e2c114957ee10838ab6e133a1c11a52a3beaaf7f33f510589a54c35a745a6c0017d6865198c7382b0800eda6711b2ef2b02e7852ce911047ddd02ba';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), {
        status: 400,
      });
    }

    const result = await query('SELECT * FROM userDetails WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        status: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        status: 401,
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return new Response(JSON.stringify({ message: 'Login successful', token }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
  }
}
