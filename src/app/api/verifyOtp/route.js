import bcrypt from 'bcryptjs';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req) {
  const { email, otp, newPassword } = await req.json();

  if (!email || !otp || !newPassword) {
    return new Response(JSON.stringify({ message: 'Email, OTP, and newPassword are required' }), { status: 400 });
  }

  await client.connect();

  try {
    // Fetch OTP and timestamp from the database
    const result = await client.query('SELECT otp, timestamp FROM otpStore WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'OTP has expired or was not generated' }), { status: 400 });
    }

    const storedOtp = result.rows[0].otp;
    const createdAt = result.rows[0].timestamp;

    const expirationTime = 5 * 60 * 1000; // 5 minutes
    const currentTime = Date.now();

    if (currentTime - new Date(createdAt).getTime() > expirationTime) {
      await client.query('DELETE FROM otpStore WHERE email = $1', [email]); // Delete expired OTP
      return new Response(JSON.stringify({ message: 'OTP has expired' }), { status: 400 });
    }

    if (storedOtp !== otp) {
      return new Response(JSON.stringify({ message: 'Invalid OTP' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await client.query('UPDATE userDetails SET password = $1 WHERE email = $2', [hashedPassword, email]);

    // Clear OTP after successful reset
    await client.query('DELETE FROM otpStore WHERE email = $1', [email]);

    return new Response(JSON.stringify({ message: 'Password reset successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error resetting password', error: error.message }), { status: 500 });
  } finally {
    await client.end();
  }
}
