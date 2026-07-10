
import { AppUser, UserRole } from '../types';

const mockUsers: { username: string; password: string; user: AppUser }[] = [
  {
    username: 'admin1',
    password: '12345678',
    user: {
      id: 'u-1',
      name: 'Admin POS',
      username: 'admin1',
      email: 'admin@example.com',
      role: 'ADMIN',
    },
  },
  {
    username: 'kasir1',
    password: '12345678',
    user: {
      id: 'u-2',
      name: 'Kasir 1',
      username: 'kasir1',
      email: 'cashier@example.com',
      role: 'CASHIER',
    },
  },
];

export interface SessionPayload {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
}

export async function authenticate(
  username: string,
  password: string
): Promise<AppUser | null> {
  const found = mockUsers.find(
    (u) => u.username === username && u.password === password
  );
  return found ? found.user : null;
}

export function createSessionValue(user: AppUser): string {
  const payload: SessionPayload = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return encodeURIComponent(JSON.stringify(payload));
}

export function parseSessionValue(value?: string): SessionPayload | null {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as SessionPayload;
  } catch {
    return null;
  }
}
