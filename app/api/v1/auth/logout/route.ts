import { verifyAccessToken } from '@/lib/auth';
import { UserService } from '@/services/user.services';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if(token){
    try {
      const { id } = verifyAccessToken(token);
      await UserService.logout(id)
    } catch {
      
    }
  }
  const res = NextResponse.json({ ok:true });
  res.cookies.delete("access_token")
  res.cookies.delete("refresh_token")
  return res
}

