
import { UserRole } from '../types';
import { verifyAccessToken } from '../auth';

export interface SessionPayload {
  id: string;
  role: UserRole;
  storeId:string
}

export async function parseSessionValue(token?: string) : Promise<SessionPayload | null> {
  if(!token) return null;

  try {
    const payload  = verifyAccessToken(token)
    console.log("payload: ", payload)

    return {
      id: payload.id as string,
      role: payload.role as UserRole,
      storeId: payload.storeId as string,
    }
  } catch {
    return null
  }
}
