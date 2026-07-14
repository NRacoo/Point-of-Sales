import { NextResponse } from 'next/server';
import { UserService } from '@/services/user.services';

export async function POST(req: Request) {
 try {
  const { email, password } = await req.json();
  const user = await UserService.Login(email, password)

  const res = NextResponse.json({
    id:user.id,
    fullName: user.fullName,
    email:user.email,
    role:user.role,
    token:user.token,
    access_token:user.access_token
  })

  res.cookies.set("access_token", user.access_token, {
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    sameSite:"lax",
    maxAge: 15 * 60,
    path:"/"
  });

  res.cookies.set("refresh_token", user.token, {
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    sameSite:"lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/api/v1/auth/refresh"
  })
  return res
  
 } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
 }
}
