import { cookies } from 'next/headers';
import { parseSessionValue, SessionPayload } from './interface/auth';

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  return parseSessionValue(sessionCookie);
}
