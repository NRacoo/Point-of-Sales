'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, BarChart3 } from 'lucide-react';
import type { SessionPayload } from '@/lib/interface/validate';

interface Props {
  user: SessionPayload | null;
  children: ReactNode;
}

export function CashierShell({ user, children }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: '/cashier', icon: ShoppingCart, label: 'POS' },
    { href: '/cashier/stats', icon: BarChart3, label: 'Sales Stats' },
  ];

  return (
    <div className="flex h-screen shell-waves-bg">
      <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-8">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
          POS
        </div>

        <nav className="flex flex-col gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === '/cashier'
                ? pathname === '/cashier'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`p-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-orange-100 text-orange-500 cursor-default'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Cashier Mode</span>
            <span className="text-sm font-semibold text-gray-900">
              Front Desk
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {user?.name ?? 'Cashier'}
              </div>
              <div className="text-gray-500">{user?.email}</div>
            </div>

            <form action="/api/v1/auth/logout" method="POST">
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-red-500 hover:text-gray-100 transition-colors">
                Logout
              </button>
            </form>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
