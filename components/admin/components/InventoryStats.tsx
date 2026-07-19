'use client';

import { AlertCircle, Package } from 'lucide-react';

interface InventoryStatsProps {
  total: number;
  lowStock: number;
  outOfStock: number;
}

export function InventoryStats({ total, lowStock, outOfStock }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Total Items</span>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="text-gray-900">{total}</div>
        <p className="text-sm text-gray-500 mt-1">Product types</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Low Stock Alerts</span>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
        </div>
        <div className="text-gray-900">{lowStock}</div>
        <p className="text-sm text-gray-500 mt-1">Items need reorder</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Out of Stock</span>
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
        </div>
        <div className="text-gray-900">{outOfStock}</div>
        <p className="text-sm text-gray-500 mt-1">Unavailable items</p>
      </div>
    </div>
  );
}