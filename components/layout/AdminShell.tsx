'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, ShoppingCart, Package, BarChart3, Settings } from 'lucide-react';
import type { SessionPayload } from '@/lib/interface/auth';

interface Props {
  user: SessionPayload | null;
  children: ReactNode;
}

export function AdminShell({ user, children }: Props) {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { href: '/admin/product', icon: Home, label: 'Catalog' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/inventory', icon: Package, label: 'Inventory' },
    { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
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
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-orange-100 text-orange-500'
                    : 'text-gray-400 hover:text-gray-600'
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
            <span className="text-xs text-gray-500">Admin Panel</span>
            <span className="text-sm font-semibold text-gray-900">
              Integrated Point of Sale System
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {user?.name ?? 'Admin'}
              </div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-red-500 hover:text-gray-100 transition-colors"
            >
                Logout
            </button>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-gray-900 mb-1">Konfirmasi Logout</h3>
            <p className="text-sm text-gray-600">Apakah Anda yakin ingin logout?</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <form action="/api/auth/logout" method="POST" className="flex-1">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                >
                  Ya, Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
