'use client';

import { Search, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Product, Pagination, STATUS_META } from '@/lib/types/inventory';

interface InventoryTableProps {
  products: Product[];
  loading: boolean;
  searchQuery: string;
  pagination: Pagination;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  onEditClick: (product: Product) => void;
  onDeleteClick: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function InventoryTable({
  products,
  loading,
  searchQuery,
  pagination,
  onSearchChange,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onPageChange,
}: InventoryTableProps) {
  return (
    <>
      {/* Search and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onAddClick}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Image</th>
                <th className="px-6 py-3 text-left text-gray-700">Product Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-gray-700">Stock</th>
                <th className="px-6 py-3 text-left text-gray-700">Reorder Level</th>
                <th className="px-6 py-3 text-left text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Last Updated</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td className="px-6 py-6 text-gray-500" colSpan={9}>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Memuat data...
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                products.map((item) => (
                  <ProductRow
                    key={item.id}
                    item={item}
                    onEdit={() => onEditClick(item)}
                    onDelete={() => onDeleteClick(item.id)}
                  />
                ))}

              {!loading && products.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-gray-500" colSpan={9}>
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} &middot; {pagination.total} items
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ProductRow({
  item,
  onEdit,
  onDelete,
}: {
  item: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const status = STATUS_META[item.status];

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-100" />
        )}
      </td>
      <td className="px-6 py-4 text-gray-900">{item.product_name}</td>
      <td className="px-6 py-4 text-gray-600">{item.category?.category_name ?? '-'}</td>
      <td className="px-6 py-4">
        <span className="text-gray-900">
          {item.stock} {item.unit}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600">{item.reorder_level} {item.unit}</td>
      <td className="px-6 py-4 text-gray-900">Rp. {item.price.toLocaleString('id-ID')}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${status.color}`}>
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600">{item.last_updated}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}