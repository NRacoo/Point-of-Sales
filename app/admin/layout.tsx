import { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/get-current-user';
import { AdminShell } from '@/components/layout/AdminShell';
import { cookies } from 'next/headers';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
    const cookieStore = await cookies();
    const uri = process.env.NEXT_PUBLIC_APP_URL;
    if(!uri) throw new Error("undefined uri")
  
    const res = await fetch(`${uri}/api/v1/user/me`, {
      headers:{
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
  
    let user = null;
    if(res.ok){
      const result = await res.json();
      user = result.data
    }
  return <AdminShell user={user}>{children}</AdminShell>;
}
