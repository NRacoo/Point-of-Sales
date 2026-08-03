'use client';

import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { CartItem } from '@/lib/types/pos';
import { formatCurrency } from '@/lib/utils/format';

interface OrderCartProps {
  cart: CartItem[];
  visible: boolean;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export function OrderCart({
  cart,
  visible,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onCheckout,
}: OrderCartProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 space-y-4 h-fit transition-all duration-300 ease-in-out ${
        visible
          ? 'lg:col-span-4 lg:translate-x-0 lg:opacity-100'
          : 'hidden lg:block lg:col-span-4 lg:translate-x-6 lg:opacity-0 lg:pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-orange-500" />
          <h2 className="text-gray-900 font-semibold">Current Order</h2>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 disabled:opacity-50"
          disabled={cart.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-sm">Add products to start an order.</p>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-12 h-12 rounded-md object-cover bg-gray-100"
              />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">Rp. {formatCurrency(item.product.price)}</p>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <button
                  onClick={() => onDecrease(item.product.id)}
                  className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => onIncrease(item.product.id)}
                  className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => onRemove(item.product.id)}
                className="p-1.5 rounded-md border border-gray-200 hover:bg-red-50 hover:border-red-200 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal</span>
          <span>Rp. {formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Tax (10%)</span>
          <span>Rp. {formatCurrency(tax)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-900 font-semibold text-lg">
          <span>Total</span>
          <span>Rp. {formatCurrency(total)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
          disabled={cart.length === 0}
        >
          Process Payment
        </button>
      </div>
    </div>
  );
}