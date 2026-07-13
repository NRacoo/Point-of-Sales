'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Login failed');
        return;
      }

      const data = await res.json();
      const role = data.user.role;
      router.push(role === 'admin' ? '/admin' : '/cashier');
    } catch (err) {
      setError('Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-orange-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
            POS
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Sign in to Cashier System
            </h1>
            <p className="text-xs text-gray-500">
              Admin & cashier access with fraud-aware POS
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder='atos@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder='enter your password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-800"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="mt-4 text-[11px] text-gray-500 border-t pt-3">
            Demo accounts:
            <ul className="mt-1 space-y-1">
              <li>Admin: admin@example.com / 123</li>
              <li>Kasir: kasir@example.com / 123</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
