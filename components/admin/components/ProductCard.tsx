'use client';

import { PosProduct } from '@/lib/types/pos';
import { formatCurrency } from '@/lib/utils/format';

interface ProductCardProps {
  product: PosProduct;
  isOrderMode: boolean;
  onAdd: (product: PosProduct) => void;
}

export function ProductCard({ product, isOrderMode, onAdd }: ProductCardProps) {
  const isClickable = isOrderMode && !product.soldOut;

  return (
    <button
      type="button"
      onClick={() => isClickable && onAdd(product)}
      className={`bg-white rounded-xl overflow-hidden border border-gray-200 w-full text-left transition-colors ${
        isClickable ? 'hover:border-orange-400 cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="relative h-40 bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {product.soldOut && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-sm rounded">
            SOLD OUT
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 capitalize">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-900">Rp. {formatCurrency(product.price)}</span>
        </div>
        <div className="text-sm text-gray-500">
          {isOrderMode
            ? product.soldOut
              ? 'Sold out'
              : 'Klik kartu untuk tambah ke order'
            : 'Aktifkan New Order untuk mulai tambah produk'}
        </div>
      </div>
    </button>
  );
}