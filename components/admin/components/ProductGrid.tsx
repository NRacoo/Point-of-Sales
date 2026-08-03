'use client';

import { PosProduct } from '@/lib/types/pos';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: PosProduct[];
  isOrderMode: boolean;
  isCompact: boolean;
  onAdd: (product: PosProduct) => void;
}

export function ProductGrid({ products, isOrderMode, isCompact, onAdd }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="text-gray-500 text-sm">Tidak ada produk yang cocok.</p>;
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${
        isCompact ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
      } gap-6 transition-all duration-300`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isOrderMode={isOrderMode} onAdd={onAdd} />
      ))}
    </div>
  );
}