import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key');

export async function GET(req) {
  const tokenObj = req.cookies.get('token');

  if (!tokenObj || !tokenObj.value) {
    return new Response(JSON.stringify({ isAdmin: false }), { status: 401 });
  }

  const token = tokenObj.value;
  console.log("Token", token);

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role === 'admin') {
      console.log("Role:", payload.role);
      return new Response(JSON.stringify({ isAdmin: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ isAdmin: false }), { status: 200 });
    }
  } catch (error) {
    console.log('Token verification failed:', error);

    if (error.code === 'ERR_JWT_EXPIRED') {
      return new Response(JSON.stringify({ isAdmin: false, message: 'Token expired. Please log in again.' }), { status: 401 });
    }

    return new Response(JSON.stringify({ isAdmin: false, message: 'Token verification failed. Please log in again.' }), { status: 401 });
  }
}
