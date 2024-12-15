import bcrypt from 'bcryptjs';
import { query } from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generation

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    // Validate required fields
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), {
        status: 400,
      });
    }

    // Check if the user already exists by email
    const userCheck = await query('SELECT * FROM UserDetails WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return new Response(JSON.stringify({ message: 'User with this email already exists' }), {
        status: 409,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique user_id (UUID)
    const user_id = uuidv4();

    // Get the current timestamp
    const currentTimestamp = new Date().toISOString();

    // Insert the new admin into the database
    await query(
      'INSERT INTO UserDetails (user_id, username, email, password, role, created_at, updated_at, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        user_id,
        username,
        email,
        hashedPassword,
        'admin', // Role is set to 'admin'
        currentTimestamp, // Created at timestamp
        currentTimestamp, // Updated at timestamp
        true, // Set is_active to true by default
      ]
    );

    // Return success response
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
