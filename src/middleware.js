import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key');

export async function middleware(req) {
  const tokenObj = req.cookies.get('token');

  if (!tokenObj) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    const token = tokenObj.value; // Ensure token is retrieved as a string from the value property
    if (typeof token !== 'string') {
      console.log('Token is not a string:', token);
      throw new Error('Token is not a string');
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('Token decoded:', payload);

    // Use the role field to check if the user is admin
    if (payload.role === 'admin') {
      return NextResponse.next();
    } else {
      console.log('User is not admin, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  } catch (error) {
    console.log('Token verification failed, redirecting to login:', error);
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard', '/admin/uploadImage'], // Include all protected routes
};
