'use client';

import { useState } from 'react';
import { Save, User, Store, Bell, CreditCard, Printer, Shield } from 'lucide-react';
import ProfileSettings from '../settings/ProfileSettings';
import StoreSettings from '../settings/StoreSettings';
import NotificationSettings from '../settings/NotificationSettings';
import PaymentSettings from '../settings/PaymentSettings';
import PrinterSettings from '../settings/PrinterSettings';
import SecuritySettings from '../settings/SecuritySettings';

type SettingsTab = 'profile' | 'store' | 'notifications' | 'payment' | 'printer' | 'security';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-500">Manage your cashier system preferences</p>
      </div>

      <div className="flex gap-6">
        <aside className="w-64 bg-white rounded-xl border border-gray-200 p-4 h-fit">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            
            <button
              onClick={() => setActiveTab('store')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'store'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Store className="w-5 h-5" />
              <span>Store Info</span>
            </button>
            
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
            
            <button
              onClick={() => setActiveTab('payment')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'payment'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Payment</span>
            </button>
            
            {/* <button
              onClick={() => setActiveTab('printer')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'printer'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Printer className="w-5 h-5" />
              <span>Printer</span>
            </button> */}
            
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'security'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Security</span>
            </button>
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (<ProfileSettings/>)}
          {activeTab === 'store' && (<StoreSettings />)}
          {activeTab === 'notifications' && (<NotificationSettings />)}
          {activeTab === 'payment' && (<PaymentSettings/>)}
          {/* {activeTab === 'printer' && (<PrinterSettings/>)} */}
          {activeTab === 'security' && (<SecuritySettings />)}
        </div>
      </div>
    </div>
  );
}

function DollarSign({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
