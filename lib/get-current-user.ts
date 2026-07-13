import { cookies } from 'next/headers';
import { parseSessionValue, SessionPayload } from './interface/validate';

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('access_token')?.value;
  return parseSessionValue(sessionCookie);
}
