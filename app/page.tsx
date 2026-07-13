// app/page.tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/get-current-user';

export default async function HomePage() {
  const user = await getCurrentUser();
  console.log("user: ", user)

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'admin') {
    redirect('/admin');
  }

  redirect('/cashier');
}
