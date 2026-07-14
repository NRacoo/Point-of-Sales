import { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/get-current-user';
import { CashierShell } from '@/components/layout/CashierShell';
import { cookies } from 'next/headers';

export default async function CashierLayout({
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

  //const user = await getCurrentUser();
  return <CashierShell user={user}>{children}</CashierShell>;
}
