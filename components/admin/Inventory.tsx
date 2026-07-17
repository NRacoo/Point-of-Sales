'use client';

import { useState, useMemo, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Search, Plus, Pencil, Trash2, AlertCircle, CheckCircle2, X } from 'lucide-react';



const mockInventory: InventoryItem[] = [
  { id: 1, name: 'Almond Brown Croissant', category: 'Croissant', stock: 45, unit: 'pcs', reorderLevel: 20, price: 34000, lastUpdated: 'Dec 8, 2024' },
  { id: 2, name: 'Basic Croissant A La Pierre', category: 'Croissant', stock: 0, unit: 'pcs', reorderLevel: 20, price: 32000, lastUpdated: 'Dec 8, 2024' },
  { id: 3, name: 'Sweet Granulated Sugar Croissant', category: 'Croissant', stock: 38, unit: 'pcs', reorderLevel: 15, price: 38000, lastUpdated: 'Dec 8, 2024' },
  { id: 4, name: 'Smoky Tenderloin Stick Croissant', category: 'Signature', stock: 0, unit: 'pcs', reorderLevel: 10, price: 45000, lastUpdated: 'Dec 8, 2024' },
  { id: 5, name: 'Sweet Chocolate Croissant', category: 'Croissant', stock: 52, unit: 'pcs', reorderLevel: 20, price: 34000, lastUpdated: 'Dec 8, 2024' },
  { id: 6, name: 'Blueberry Jam Croissant', category: 'Croissant', stock: 15, unit: 'pcs', reorderLevel: 20, price: 32000, lastUpdated: 'Dec 8, 2024' },
  { id: 7, name: 'Strawberry Jam Croissant', category: 'Croissant', stock: 28, unit: 'pcs', reorderLevel: 20, price: 32000, lastUpdated: 'Dec 8, 2024' },
  { id: 8, name: 'Belgian Waffle', category: 'Waffle', stock: 34, unit: 'pcs', reorderLevel: 15, price: 28000, lastUpdated: 'Dec 8, 2024' },
  { id: 9, name: 'Coffee Latte', category: 'Coffee', stock: 120, unit: 'cups', reorderLevel: 50, price: 25000, lastUpdated: 'Dec 8, 2024' },
];

type ModalMode = 'add' | 'edit';

function useAnimatedMount(isOpen: boolean, duration = 200) {
  const [mounted, setMounted] = useState(isOpen);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const id = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(id);
    } else {
      setActive(false);
      const t = window.setTimeout(() => setMounted(false), duration);
      return () => window.clearTimeout(t);
    }
  }, [isOpen, duration]);

  return { mounted, active };
}

export function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchQuery, setSearchQuery] = useState('');

  // modal add/edit (tetap pakai showAddModal supaya layout sama)
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingId, setEditingId] = useState<number | null>(null);

  // form state (layout sama, tapi jadi controlled)
  const [form, setForm] = useState({
    name: '',
    category: 'Croissant',
    stock: '',
    unit: 'pcs',
    reorderLevel: '',
  });

  // price digits (untuk format Rp + ribuan)
  const [digits, setDigits] = useState('');

  const formatted = useMemo(() => {
    if (!digits) return '';
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(digits));
  }, [digits]);

  // toast
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const showToast = (message: string) => {
    setToast({ open: true, message });
    window.setTimeout(() => setToast((t) => ({ ...t, open: false })), 2500);
  };

  // confirm add
  const [showConfirmAdd, setShowConfirmAdd] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<Omit<InventoryItem, 'id'> | null>(null);

  // delete confirm
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filteredInventory = useMemo(() => {
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inventory, searchQuery]);

  const lowStockItems = filteredInventory.filter((item) => item.stock <= item.reorderLevel);
  const outOfStockItems = filteredInventory.filter((item) => item.stock === 0);

  const getStockStatus = (item: InventoryItem) => {
    if (item.stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (item.stock <= item.reorderLevel) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  const formatLastUpdated = () =>
    new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setForm({ name: '', category: 'Croissant', stock: '', unit: 'pcs', reorderLevel: '' });
    setDigits('');
    setShowAddModal(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setModalMode('edit');
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      stock: String(item.stock),
      unit: item.unit,
      reorderLevel: String(item.reorderLevel),
    });
    setDigits(String(item.price));
    setShowAddModal(true);
  };

  const buildPayload = (): Omit<InventoryItem, 'id'> => ({
    name: form.name.trim(),
    category: form.category,
    stock: Number(form.stock || 0),
    unit: form.unit.trim() || 'pcs',
    reorderLevel: Number(form.reorderLevel || 0),
    price: Number(digits || 0),
    lastUpdated: formatLastUpdated(),
  });

  // submit form: kalau ADD -> buka confirm, kalau EDIT -> langsung save
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();

    if (!payload.name) {
      showToast('Nama produk wajib diisi');
      return;
    }

    if (modalMode === 'add') {
      setPendingPayload(payload);
      setShowConfirmAdd(true);
      return;
    }

    // edit
    if (editingId == null) return;
    setInventory((prev) => prev.map((it) => (it.id === editingId ? { ...it, ...payload } : it)));
    setShowAddModal(false);
    showToast('Item berhasil diperbarui');
  };

  const handleConfirmAdd = () => {
    if (!pendingPayload) return;

    setInventory((prev) => {
      const nextId = (prev.reduce((m, it) => Math.max(m, it.id), 0) || 0) + 1;
      return [...prev, { id: nextId, ...pendingPayload }];
    });

    setShowConfirmAdd(false);
    setPendingPayload(null);
    setShowAddModal(false);
    setDigits('');
    setForm({ name: '', category: 'Croissant', stock: '', unit: 'pcs', reorderLevel: '' });
    showToast('Item berhasil ditambahkan!');
  };

  const askDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteId == null) return;
    setInventory((prev) => prev.filter((it) => it.id !== deleteId));
    setShowDeleteConfirm(false);
    setDeleteId(null);
    showToast('Item berhasil dihapus');
  };

  // animasi (tanpa ubah layout)
  const addAnim = useAnimatedMount(showAddModal, 200);
  const confirmAnim = useAnimatedMount(showConfirmAdd, 200);
  const delAnim = useAnimatedMount(showDeleteConfirm, 200);
  const toastAnim = useAnimatedMount(toast.open, 200);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Inventory Management</h1>
        <p className="text-gray-500">Track and manage your product stock levels</p>
      </div>

 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Items</span>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-gray-900">{inventory.length}</div>
          <p className="text-sm text-gray-500 mt-1">Product types</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Low Stock Alerts</span>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-gray-900">{lowStockItems.length}</div>
          <p className="text-sm text-gray-500 mt-1">Items need reorder</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Out of Stock</span>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="text-gray-900">{outOfStockItems.length}</div>
          <p className="text-sm text-gray-500 mt-1">Unavailable items</p>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={openAddModal}
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
              {filteredInventory.map((item) => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.reorderLevel} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-gray-900">Rp. {item.price.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.lastUpdated}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={() => openEditModal(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => askDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInventory.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-gray-500" colSpan={8}>
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal (layout sama) */}
      {addAnim.mounted && (
        <div
          className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50
          transition-opacity duration-200 ease-out ${addAnim.active ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className={`bg-white rounded-xl max-w-md w-full p-6
            transition-all duration-200 ease-out
            ${addAnim.active ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-gray-900 mb-6">
              {modalMode === 'add' ? 'Add New Item' : 'Edit Item'}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option>Croissant</option>
                  <option>Waffle</option>
                  <option>Coffee</option>
                  <option>Ice Cream</option>
                  <option>Signature</option>
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
                    onChange={(e) =>
                      setForm((f) => ({ ...f, stock: e.target.value.replace(/\D/g, '') }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Unit</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="pcs"
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
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
                  value={form.reorderLevel}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reorderLevel: e.target.value.replace(/\D/g, '') }))
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Price</label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    Rp
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full pl-12 pr-4 py-2.5 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0"
                    value={formatted}
                    onChange={(e) => setDigits(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              {/* (layout kamu sebelumnya ada Image URL — tetap ditampilkan, tidak disimpan) */}
              <div>
                <label className="block text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {modalMode === 'add' ? 'Add Item' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Add (layout sama, tapi tidak nested dobel) */}
      {confirmAnim.mounted && (
        <div
          className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]
          transition-opacity duration-200 ease-out ${confirmAnim.active ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowConfirmAdd(false)}
        >
          <div
            className={`bg-white rounded-xl max-w-sm w-full p-6
            transition-all duration-200 ease-out
            ${confirmAnim.active ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>

              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Konfirmasi</h3>
                <p className="text-gray-600 text-sm">Apakah Anda yakin ingin menambahkan barang ini?</p>
              </div>
            </div>

            <div className="flex gap-3 pt-5">
              <button
                type="button"
                onClick={() => setShowConfirmAdd(false)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-gray-100 rounded-lg hover:bg-red-600 transition-colors"
              >
                Tidak
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Ya, Tambahkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {delAnim.mounted && (
        <div
          className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]
          transition-opacity duration-200 ease-out ${delAnim.active ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className={`bg-white rounded-xl max-w-sm w-full p-6
            transition-all duration-200 ease-out
            ${delAnim.active ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Hapus Item</h3>
                <p className="text-gray-600 text-sm">Yakin ingin menghapus item ini?</p>
              </div>
            </div>

            <div className="flex gap-3 pt-5">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastAnim.mounted && (
        <div className="fixed top-4 right-4 z-[9999]">
          <div
            className={`flex items-center gap-3 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3
            transition-all duration-200 ease-out
            ${toastAnim.active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
          >
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-800">{toast.message}</p>
            <button
              type="button"
              className="ml-2 p-1 rounded-lg hover:bg-gray-100"
              onClick={() => setToast((t) => ({ ...t, open: false }))}
              aria-label="Close toast"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}
