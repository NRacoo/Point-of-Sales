'use client';

import { useMemo } from 'react';
import type { FormEvent } from 'react';
import { useAnimatedMount } from '../hooks/useAnimatedMount';
import { Category, ProductFormState } from "@/lib/types/inventory"

interface ProductFormModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  form: ProductFormState;
  digits: string;
  categories: Category[];
  imagePreview: string | null;
  submitting: boolean;
  onClose: () => void;
  onFormChange: (form: ProductFormState) => void;
  onDigitsChange: (digits: string) => void;
  onImageChange: (file: File | null) => void;
  onSubmit: (e: FormEvent) => void;
}

export function ProductFormModal({
  open,
  mode,
  form,
  digits,
  categories,
  imagePreview,
  submitting,
  onClose,
  onFormChange,
  onDigitsChange,
  onImageChange,
  onSubmit,
}: ProductFormModalProps) {
  const anim = useAnimatedMount(open, 200);

  const formattedPrice = useMemo(() => {
    if (!digits) return '';
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(digits));
  }, [digits]);

  if (!anim.mounted) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50
      transition-opacity duration-200 ease-out ${anim.active ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto
        transition-all duration-200 ease-out
        ${anim.active ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-gray-900 mb-6">{mode === 'add' ? 'Add New Item' : 'Edit Item'}</h2>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter product name"
              value={form.product_name}
              onChange={(e) => onFormChange({ ...form, product_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={form.categoryId}
              onChange={(e) => onFormChange({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Stock</label>
              <input
                type="text"
                inputMode="numeric"
                className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
                value={form.stock}
                onChange={(e) => onFormChange({ ...form, stock: e.target.value.replace(/\D/g, '') })}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Unit</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="pcs"
                value={form.unit}
                onChange={(e) => onFormChange({ ...form, unit: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Reorder Level</label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="20"
              value={form.reorder_level}
              onChange={(e) => onFormChange({ ...form, reorder_level: e.target.value.replace(/\D/g, '') })}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                className="w-full pl-12 pr-4 py-2.5 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
                value={formattedPrice}
                onChange={(e) => onDigitsChange(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
            />
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="preview" className="mt-3 w-20 h-20 rounded-lg object-cover" />
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving...' : mode === 'add' ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}