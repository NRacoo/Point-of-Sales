'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProducts } from '../hooks/useProduct';
import { CartItem, PosProduct, toPosProduct } from '@/lib/types/pos';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductGrid } from '../components/ProductGrid';
import { OrderCart } from '../components/OrderCart';

const CURRENT_ORDER_KEY = 'pos.currentOrder';

export default function ProductCatalog() {
  const router = useRouter();
  const { products: rawProducts, isLoading, error } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showOrder, setShowOrder] = useState(false);

  const products = useMemo(() => rawProducts.map(toPosProduct), [rawProducts]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [products, selectedCategory, searchQuery]
  );

  const handleAddToCart = (product: PosProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleIncreaseById = (productId: string) => {
    const item = cart.find((cartItem) => cartItem.product.id === productId);
    if (item) handleAddToCart(item.product);
  };

  const handleDecrease = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClear = () => setCart([]);

  const handleProcessPayment = () => {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const payload = {
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      subtotal,
      tax,
      total,
    };

    try {
      sessionStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(payload));
      router.push('/payment');
    } catch (err) {
      console.error('Failed to store order in session storage', err);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1 text-2xl font-semibold">Welcome, Admin</h1>
        <p className="text-gray-500">
          {isLoading ? 'Loading products…' : `You have ${products.length} product in inventory`}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          Gagal memuat produk: {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={() => setShowOrder((prev) => !prev)}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
        >
          {showOrder ? 'Hide Order' : 'New Order'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div
          className={`space-y-6 transition-all duration-300 ease-in-out ${
            showOrder ? 'lg:col-span-8 lg:-translate-x-1' : 'lg:col-span-12'
          }`}
        >
          <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading products…</p>
          ) : (
            <ProductGrid
              products={filteredProducts}
              isOrderMode={showOrder}
              isCompact={showOrder}
              onAdd={handleAddToCart}
            />
          )}
        </div>

        <OrderCart
          cart={cart}
          visible={showOrder}
          onIncrease={handleIncreaseById}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onClear={handleClear}
          onCheckout={handleProcessPayment}
        />
      </div>

      {showOrder && (
        <div className="lg:hidden mt-6 bg-white border border-gray-200 rounded-xl p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Total items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>
      )}
    </div>
  );
}