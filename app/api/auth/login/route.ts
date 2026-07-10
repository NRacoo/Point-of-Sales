import { NextResponse } from 'next/server';
import { authenticate, createSessionValue } from '@/lib/interface/auth';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = await authenticate(username, password);
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ user });
  res.cookies.set('session', createSessionValue(user), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  return res;
}
