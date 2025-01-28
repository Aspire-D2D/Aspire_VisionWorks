import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function connectClient() {
  if (!client._connected) {
    await client.connect();
  }
}

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  try {
    await connectClient();

    const result = await client.query('SELECT * FROM userDetails WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'User not found, Contact admin' }), { status: 400 });
    }

    const currentTime = new Date(); // Use Date object to store current timestamp
    const lastOtpTime = await client.query('SELECT timestamp FROM otpStore WHERE email = $1', [email]);

    // Check if OTP has been generated in the last 2 minutes
    if (lastOtpTime.rows.length > 0 && (currentTime.getTime() - new Date(lastOtpTime.rows[0].timestamp).getTime()) < 2 * 60 * 1000) {
      const timeLeft = Math.ceil((2 * 60 * 1000 - (currentTime.getTime() - new Date(lastOtpTime.rows[0].timestamp).getTime())) / 1000);
      return new Response(JSON.stringify({ message: `Try again in ${timeLeft} seconds` }), { status: 400 });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP and timestamp in the database as a valid timestamp string
    await client.query(
      'INSERT INTO otpStore (email, otp, timestamp) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET otp = $2, timestamp = $3',
      [email, otp, currentTime.toISOString()]  // Save the timestamp as ISO string
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'OTP sent successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to send OTP', error: error.message }), { status: 500 });
  }
}
