import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('firebaseAuthToken');

  if (!token) {
    return NextResponse.redirect(new URL('/user/login', req.url));
  }

  const user = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));

  if (!user.emailVerified) {
    return NextResponse.redirect(new URL('/user/verify', req.url));
  }

  return NextResponse.next();
}
